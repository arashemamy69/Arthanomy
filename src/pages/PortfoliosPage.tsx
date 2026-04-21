import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PieChart, Briefcase, TrendingUp, Shield, ArrowRight, Coins, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function MiniPortfolioChart({ holdings }: { holdings: any[] }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ holdings, periodYears: 5, drip: true, initialAmount: 100000 })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.chartData) {
          setData(resData.chartData);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [holdings]);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">Loading simulation...</div>;
  }

  if (data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorMini" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="totalValue" 
          stroke="#2563eb" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorMini)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const PORTFOLIOS = [
  {
    id: 'balanced-portfolio',
    name: 'Balanced Portfolio',
    description: 'A balanced approach to growth and income, featuring a mix of top US tech giants and high-yield Canadian ETFs.',
    allocation: [
      { asset: 'US Tech Equities', percentage: 40, color: 'bg-blue-600' },
      { asset: 'Canadian High Yield ETFs', percentage: 60, color: 'bg-teal-500' }
    ],
    holdings: [
      { ticker: "AAPL", weight: 7 },
      { ticker: "AMZN", weight: 7 },
      { ticker: "GOOG", weight: 7 },
      { ticker: "META", weight: 7 },
      { ticker: "MSFT", weight: 7 },
      { ticker: "NVDA", weight: 5 },
      { ticker: "V", weight: 2 },
      { ticker: "MA", weight: 2 },
      { ticker: "COST", weight: 2 },
      { ticker: "WMT", weight: 2 },
      { ticker: "JNJ", weight: 2 },
      { ticker: "HYLD.TO", weight: 15 },
      { ticker: "HDIV.TO", weight: 10 },
      { ticker: "HMAX.TO", weight: 10 },
      { ticker: "ZWC.TO", weight: 10 },
      { ticker: "ZWU.TO", weight: 5 }
    ],
    risk: 'Moderate-High',
    icon: <Scale className="w-6 h-6" />
  },
  {
    id: 'classic',
    name: 'Classic Portfolio',
    description: 'A traditional mix of equities and fixed income for steady, reliable long-term growth. Perfect for hands-off investors.',
    allocation: [
      { asset: 'Global Equities', percentage: 80, color: 'bg-blue-500' },
      { asset: 'Bonds', percentage: 20, color: 'bg-gray-400' }
    ],
    risk: 'Moderate',
    icon: <Briefcase className="w-6 h-6" />
  },
  {
    id: 'growth',
    name: 'Growth Portfolio',
    description: 'Equities-focused approach designed to maximize capital appreciation over a longer time horizon. Higher volatility, but historically higher returns.',
    allocation: [
      { asset: 'US Equities', percentage: 60, color: 'bg-blue-600' },
      { asset: 'International Equities', percentage: 30, color: 'bg-blue-400' },
      { asset: 'Emerging Markets', percentage: 10, color: 'bg-teal-500' }
    ],
    risk: 'High',
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    id: 'income',
    name: 'Income Portfolio',
    description: 'Dividend and yield-focused strategy to generate consistent cash flow during the drawdown phase. Prioritizes capital preservation.',
    allocation: [
      { asset: 'Dividend Equities', percentage: 40, color: 'bg-indigo-500' },
      { asset: 'Corporate Bonds', percentage: 30, color: 'bg-gray-500' },
      { asset: 'Government Bonds', percentage: 20, color: 'bg-gray-400' },
      { asset: 'REITs', percentage: 10, color: 'bg-purple-500' }
    ],
    risk: 'Low-Moderate',
    icon: <Coins className="w-6 h-6" />
  }
];

export default function PortfoliosPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Model Portfolios</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Explore our collection of battle-tested investment strategies. Whether you're looking for hands-off growth or capital preservation, there's a portfolio for your goals.
        </p>
      </motion.div>

      <div className="flex flex-col gap-8">
        {PORTFOLIOS.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-8"
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-800 mb-6">
                {portfolio.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{portfolio.name}</h3>
              <p className="text-gray-600 mb-6">{portfolio.description}</p>
              
              <div className="flex items-center gap-2 text-sm font-medium mb-6">
                <span className="text-gray-500">Risk Profile:</span>
                <span className="text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{portfolio.risk}</span>
              </div>
              
              <Link to={`/portfolios/${portfolio.id}`} className="inline-flex w-full md:w-auto py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-medium transition-colors items-center justify-center gap-2">
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex-1 bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col">
              <h4 className="font-bold mb-4 text-sm text-gray-500 uppercase tracking-wider">
                {portfolio.holdings ? '5-Year Growth (Simulated)' : 'Target Allocation'}
              </h4>
              {portfolio.holdings ? (
                <Link to={`/portfolios/${portfolio.id}`} className="flex-1 min-h-[200px] block relative group cursor-pointer">
                  <div className="absolute inset-0 z-10 transition-colors group-hover:bg-white/10 rounded-2xl" />
                  <MiniPortfolioChart holdings={portfolio.holdings} />
                </Link>
              ) : (
                <div className="space-y-4">
                  {portfolio.allocation.map((item) => (
                    <div key={item.asset}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">{item.asset}</span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
