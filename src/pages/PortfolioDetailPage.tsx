import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, DollarSign, PieChart, Info } from 'lucide-react';
import { getPortfolioBySlug, SanityPortfolio } from '../lib/sanity';
import { useTheme } from '../ThemeContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PortfolioDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  
  const [portfolio, setPortfolio] = useState<SanityPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);
  
  const [period, setPeriod] = useState<number>(5);
  const [drip, setDrip] = useState<boolean>(true);

  useEffect(() => {
    if (slug) {
      getPortfolioBySlug(slug).then(data => {
        setPortfolio(data);
        setLoading(false);
      });
    }
  }, [slug]);

  useEffect(() => {
    if (portfolio) {
      runSimulation();
    }
  }, [portfolio, period, drip]);

  const runSimulation = async () => {
    if (!portfolio) return;
    setSimulating(true);
    try {
      const response = await fetch('/api/portfolio/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdings: portfolio.holdings,
          periodYears: period,
          drip,
          initialAmount: 100000
        })
      });
      const data = await response.json();
      setSimulationData(data);
    } catch (error) {
      console.error("Simulation failed", error);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Portfolio Not Found</h1>
        <Link to="/portfolios" className="text-blue-600 hover:underline">Back to Portfolios</Link>
      </div>
    );
  }

  const formatCurrency = (val: number, options: { withCents?: boolean } = {}) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: options.withCents ? 2 : 0,
      minimumFractionDigits: options.withCents ? 2 : 0
    }).format(val);
  };

  const handleDownloadCSV = () => {
    if (!simulationData?.chartData || simulationData.chartData.length === 0) return;

    const rows = [];
    // Define headers based on what exists in the data
    const firstRowHoldings = Object.keys(simulationData.chartData[0].holdings || {});
    const headers = [
      'Date', 
      'Total Value', 
      'Principal Invested', 
      'Total Dividends Collected (Cumulative)', 
      'Total Uninvested Cash CAD',
      ...firstRowHoldings.map(t => `${t} (Value CAD)`),
      ...firstRowHoldings.map(t => `${t} (Shares)`),
      ...firstRowHoldings.map(t => `${t} (Price Native)`),
      ...firstRowHoldings.map(t => `${t} (Distribution CAD)`)
    ];
    rows.push(headers.join(','));

    for (const row of simulationData.chartData) {
      let totalCash = 0;
      for (const t of firstRowHoldings) {
        totalCash += (row.holdings[t]?.cashBalance || 0);
      }

      const rowData = [
        row.date,
        row.totalValue.toFixed(2),
        row.principal.toFixed(2),
        row.totalDividends.toFixed(2),
        totalCash.toFixed(2)
      ];
      for (const t of firstRowHoldings) {
        const val = (row.holdings[t]?.shares || 0) * (row.holdings[t]?.price || 0) * (row.holdings[t]?.fxRate || 1);
        rowData.push(val.toFixed(2));
      }
      for (const t of firstRowHoldings) {
        rowData.push(row.holdings[t]?.shares?.toFixed(4) || '0.0000');
      }
      for (const t of firstRowHoldings) {
        rowData.push(row.holdings[t]?.price?.toFixed(2) || '0.00');
      }
      for (const t of firstRowHoldings) {
        rowData.push(row.holdings[t]?.totalDistribution?.toFixed(2) || '0.00');
      }
      rows.push(rowData.join(','));
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${portfolio.title.replace(/\s+/g, '_')}_${period}Y_Simulation.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="pt-24 pb-12 px-6 bg-[#EEECE7]">
        <div className="max-w-7xl mx-auto">
          <Link to="/portfolios" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 mb-8 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolios
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {portfolio.title}
          </h1>
          {portfolio.description && (
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              {portfolio.description}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Stats Row 1 */}
        {simulationData && (
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Total Growth</span>
              </div>
              <div className={`text-4xl font-bold ${simulationData.summary.totalGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {simulationData.summary.totalGrowth >= 0 ? '+' : ''}{simulationData.summary.totalGrowth.toFixed(2)}%
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Current Value</span>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {formatCurrency(simulationData.summary.finalValue)}
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <PieChart className="w-5 h-5" />
                <span className="font-medium">Distributions Collected</span>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {formatCurrency(simulationData.summary.totalDividendsCollected)}
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Est. Annual Income</span>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {formatCurrency(simulationData.summary.totalAnnualIncome || 0)}
              </div>
            </div>
          </div>
        )}

        {/* Stats Row 2 */}
        {simulationData && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <PieChart className="w-5 h-5" />
                <span className="font-medium">Portfolio Yield</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {simulationData.summary.portfolioYield?.toFixed(2)}%
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Yield on Initial Investment</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {simulationData.summary.yieldOnCost?.toFixed(2)}%
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-black/5">
              <div className="flex items-center gap-3 mb-2 text-gray-500">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Annualized Return</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {simulationData.summary.annualizedReturn >= 0 ? '+' : ''}{simulationData.summary.annualizedReturn?.toFixed(2)}%
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="h-[500px] w-full bg-white border border-black/5 rounded-3xl p-6 mb-8 relative">
          {simulating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          {simulationData && simulationData.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => {
                    const [year, month] = val.split('-');
                    const d = new Date(Number(year), Number(month) - 1, 15);
                    return `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`;
                  }}
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  stroke="#9ca3af"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickMargin={10}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Total Value (CAD)']}
                  labelFormatter={(label) => {
                    const [year, month] = label.split('-');
                    const d = new Date(Number(year), Number(month) - 1, 15);
                    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalValue" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            !simulating && <div className="h-full flex items-center justify-center text-gray-500">No data available for this period.</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {[1, 3, 5].map(y => (
              <button
                key={y}
                onClick={() => setPeriod(y)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${period === y ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {y} Year{y > 1 ? 's' : ''}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setDrip(false)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${!drip ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Cash Dividends
            </button>
            <button
              onClick={() => setDrip(true)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${drip ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              DRIP (Reinvest)
            </button>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="mb-12">
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-bold">
              Portfolio Holdings
            </h2>
            <p className="text-sm text-gray-500 mt-1">$100K CAD initial investment</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-black/5">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-900 border-b border-black/5">
                <tr>
                  <th className="px-6 py-4 font-bold">Ticker</th>
                  <th className="px-6 py-4 font-bold">Initial Weight</th>
                  <th className="px-6 py-4 font-bold">Current Value</th>
                  <th className="px-6 py-4 font-bold">Div Yield</th>
                  <th className="px-6 py-4 font-bold">Est. Monthly Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {simulationData?.holdingsStats ? (
                  simulationData.holdingsStats.sort((a: any, b: any) => b.weight - a.weight).map((h: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{h.ticker.replace('.TO', '')}</td>
                      <td className="px-6 py-4 text-gray-700">{h.weight}%</td>
                      <td className="px-6 py-4 text-gray-700">{formatCurrency(h.finalValue)}</td>
                      <td className="px-6 py-4 text-gray-700">{h.yield.toFixed(2)}%</td>
                      <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(h.monthlyIncome, { withCents: true })}</td>
                    </tr>
                  ))
                ) : (
                  portfolio.holdings.map((h, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-gray-900">{h.ticker.replace('.TO', '')}</td>
                      <td className="px-6 py-4 text-gray-700">{h.weight}%</td>
                      <td className="px-6 py-4 text-gray-500" colSpan={3}>Loading data...</td>
                    </tr>
                  ))
                )}
              </tbody>
              {simulationData?.summary?.totalAnnualIncome > 0 && (
                <tfoot className="bg-gray-50 border-t border-black/5">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right font-bold text-gray-900">Total Est. Monthly Income</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(simulationData.summary.totalAnnualIncome / 12, { withCents: true })}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          
          {simulationData && simulationData.chartData && simulationData.chartData.length > 0 && (
            <div className="mt-4 flex justify-start">
              <button 
                onClick={handleDownloadCSV}
                className="text-sm font-bold text-gray-900 hover:text-black hover:underline"
              >
                Download .CSV Raw Data
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 mb-24">
        <div className="flex flex-col gap-4 text-gray-900 text-sm">
          <div className="flex gap-3">
            <Info className="w-5 h-5 shrink-0" />
            <div>
              <p className="mb-2">
                <strong>Note:</strong> Initial investment is assumed to be $100,000 CAD. Please note that currency conversion (e.g., USD to CAD) is not currently factored into the simulation for foreign holdings; the exact allocation simulates 1:1 parity with the asset's active exchange price history. Estimated monthly income is based on exact trailing-twelve-month historical dividend cash generated per share. The chart simulation uses exact historical dividend payouts. Accuracy depends on the data source (Yahoo Finance) and may not be 100% precise. The chart and numbers are for demonstration purposes and cannot be relied on for financial advice.
              </p>
              {simulationData?.missingDataAssets && simulationData.missingDataAssets.length > 0 && (
                <div>
                  <strong>Inception Note:</strong> The following assets were created after the selected {period}-year period started. The simulation assumes their allocated capital remained in cash until their inception date:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {simulationData.missingDataAssets.map((asset: any, idx: number) => (
                      <li key={idx}><span className="font-semibold">{asset.ticker.replace('.TO', '')}</span> (Inception approx: {new Date(asset.firstPriceDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
