import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Parser from "rss-parser";
import dotenv from "dotenv";
import YahooFinance from 'yahoo-finance2';
import fs from 'fs/promises';

dotenv.config();

const yahooFinance = new YahooFinance();

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator', 'enclosure']
  }
});

const CACHE_FILE = path.join(process.cwd(), '.yahoo-cache.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function readCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

async function writeCache(cache: any) {
  try {
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (e) {
    console.error("Failed to write cache file", e);
  }
}

async function getCachedYahooData(ticker: string, period1: string, type: 'historical' | 'dividends' | 'quote') {
  const cache = await readCache();
  const key = `${ticker}_${type}_${period1}`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < CACHE_DURATION_MS)) {
    return cache[key].data;
  }

  let data;
  try {
    if (type === 'historical') {
      const res = await yahooFinance.chart(ticker, { period1, interval: '1mo' });
      data = res.quotes;
    } else if (type === 'dividends') {
      const res = await yahooFinance.chart(ticker, { period1, interval: '1mo' });
      data = res.events?.dividends || [];
    } else if (type === 'quote') {
      data = await yahooFinance.quote(ticker);
    }
  } catch (e) {
    console.error(`Error fetching ${type} for ${ticker}:`, e);
    // Return empty array/null on failure to not break the whole simulation
    data = type === 'quote' ? null : [];
  }

  cache[key] = { data, timestamp: Date.now() };
  await writeCache(cache);
  
  return data;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/finance/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      const period1 = startDate.toISOString().split('T')[0];

      const data = await getCachedYahooData(ticker, period1, 'historical');
      
      // Map to the format the frontend expects (similar to EODHD)
      const formattedData = data.map((d: any) => {
        const dDate = new Date(d.date);
        return {
          date: dDate.toISOString().split('T')[0],
          adjusted_close: d.adjclose || d.adjClose || d.close,
          close: d.close
        };
      });
      
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching Yahoo data:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch data' });
    }
  });

  app.post("/api/portfolio/simulate", async (req, res) => {
    try {
      const { holdings, periodYears = 5, drip = false, initialAmount = 100000 } = req.body;
      
      if (!holdings || !Array.isArray(holdings)) {
        return res.status(400).json({ error: "Invalid holdings" });
      }

      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - periodYears);
      // Set to first day of the month to align data
      startDate.setDate(1);
      const period1 = startDate.toISOString().split('T')[0];

      // Fetch all data in parallel including CAD=X for FX
      const [tickerData, fxHistoricalData, fxQuoteData] = await Promise.all([
        Promise.all(holdings.map(async (h: any) => {
          const [historical, dividends, quote] = await Promise.all([
            getCachedYahooData(h.ticker, period1, 'historical'),
            getCachedYahooData(h.ticker, period1, 'dividends'),
            getCachedYahooData(h.ticker, period1, 'quote')
          ]);
          return { ticker: h.ticker, weight: h.weight, historical, dividends, quote };
        })),
        getCachedYahooData('CAD=X', period1, 'historical').catch(() => []),
        getCachedYahooData('CAD=X', period1, 'quote').catch(() => ({ regularMarketPrice: 1.35 }))
      ]);

      // Create an FX Map for USD -> CAD conversion by month
      const fxMap = new Map();
      if (fxHistoricalData && fxHistoricalData.length > 0) {
        fxHistoricalData.forEach((d: any) => {
          const dDate = new Date(d.date);
          fxMap.set(`${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}`, d.adjclose || d.adjClose || d.close);
        });
      }
      const currentFxRate = fxQuoteData?.regularMarketPrice || 1;

      // Build a timeline of months
      const timeline: Record<string, any> = {};
      let currentDate = new Date(startDate);
      const endDate = new Date();
      
      while (currentDate <= endDate) {
        const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        timeline[monthKey] = { date: monthKey, totalValue: 0, principal: 0, totalDividends: 0 };
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      let totalDividendsCollected = 0;
      let totalAnnualIncome = 0;
      const holdingsStats = [];
      const missingDataAssets = [];

      for (const tData of tickerData) {
        let allocatedCashCAD = initialAmount * (tData.weight / 100);
        let shares = 0;
        let cashBalanceCAD = 0;
        let firstPrice = 0;
        let firstPriceFx = 1;
        
        const isUSD = tData.quote?.currency === 'USD';

        let firstPriceDate = null;

        // Map data by month for easy lookup
        const priceMap = new Map();
        if (tData.historical && tData.historical.length > 0) {
          firstPriceDate = tData.historical[0].date;
          tData.historical.forEach((d: any) => {
            const dDate = new Date(d.date);
            priceMap.set(`${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}`, d.adjclose || d.adjClose || d.close);
          });
        }
        
        if (firstPriceDate) {
          const firstDate = new Date(firstPriceDate);
          const start = new Date(startDate);
          // If the first price is more than a month after the start of our period, log it
          if (firstDate.getTime() > start.getTime() + (30 * 24 * 60 * 60 * 1000)) {
            missingDataAssets.push({
              ticker: tData.ticker,
              firstPriceDate
            });
          }
        }

        const divMap = new Map();
        if (tData.dividends) {
          tData.dividends.forEach((d: any) => {
            const dDate = new Date(d.date);
            const key = `${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}`;
            const divAmount = d.dividends || d.amount || d.adjDividend || 0;
            divMap.set(key, (divMap.get(key) || 0) + divAmount);
          });
        }

        // Simulate month by month
        for (const monthKey of Object.keys(timeline)) {
          const price = priceMap.get(monthKey);
          const dividend = divMap.get(monthKey) || 0;
          const fxRate = isUSD ? (fxMap.get(monthKey) || currentFxRate) : 1;

          if (price && shares === 0 && allocatedCashCAD > 0) {
            // Initial purchase
            // Convert CAD cash to native currency (e.g. USD) to figure out native shares
            const allocatedCashNative = allocatedCashCAD / fxRate;
            shares = allocatedCashNative / price;
            firstPrice = price;
            firstPriceFx = fxRate;
            allocatedCashCAD = 0;
          }

          let payoutNative = 0;
          if (shares > 0 && dividend > 0) {
            payoutNative = shares * dividend;
            const payoutCAD = payoutNative * fxRate;
            totalDividendsCollected += payoutCAD;
            
            if (drip && price) {
              // Buy shares directly in native currency
              shares += payoutNative / price;
            } else {
              cashBalanceCAD += payoutCAD;
            }
          }

          const nativeTotalValue = shares * (price || firstPrice);
          const cadTotalValue = nativeTotalValue * fxRate;
          const currentValueCAD = cadTotalValue + cashBalanceCAD + allocatedCashCAD;
          
          timeline[monthKey].totalValue += currentValueCAD;
          // Estimate of principal vs dividends for the chart in CAD
          timeline[monthKey].principal += (shares * firstPrice * firstPriceFx) + allocatedCashCAD;
          timeline[monthKey].totalDividends += cashBalanceCAD;

          // Track raw data for exports
          if (!timeline[monthKey].holdings) {
            timeline[monthKey].holdings = {};
          }
          timeline[monthKey].holdings[tData.ticker] = {
            shares,
            price: price || firstPrice,
            fxRate,
            dividendPerShare: dividend,
            totalDistribution: payoutNative * fxRate, // record in CAD
            cashBalance: cashBalanceCAD + allocatedCashCAD // record cash held specifically for this ETF (uninvested or accumulated divs)
          };
        }

        // Current stats for the table
        const currentPriceNative = tData.quote?.regularMarketPrice || 0;
        
        // Find exactly the trailing 12 months sum of dividends per share
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        let trailingAnnualDividendPerShareNative = 0;
        if (tData.dividends && tData.dividends.length > 0) {
          trailingAnnualDividendPerShareNative = tData.dividends
            .filter((d: any) => new Date(d.date) >= oneYearAgo)
            .reduce((sum: number, d: any) => sum + (d.dividends || d.amount || d.adjDividend || 0), 0);
        }

        // Calculate yield based on real historical trailing payouts
        let trailingAnnualDividendYield = currentPriceNative > 0 ? trailingAnnualDividendPerShareNative / currentPriceNative : 0;
        
        // Calculate estimated annual income based on the END state of the simulation
        // The value of the asset in CAD
        const finalAssetValueCAD = shares * currentPriceNative * (isUSD ? currentFxRate : 1);
        // Estimated annual income uses the exact trailing 12 mo dividend cash times the number of shares held, converted to CAD
        const estimatedAnnualIncomeCAD = shares * trailingAnnualDividendPerShareNative * (isUSD ? currentFxRate : 1);
        totalAnnualIncome += estimatedAnnualIncomeCAD;
        
        holdingsStats.push({
          ticker: tData.ticker,
          weight: tData.weight,
          price: currentPriceNative * (isUSD ? currentFxRate : 1), // Standardize quoted price column to CAD
          yield: trailingAnnualDividendYield * 100,
          monthlyIncome: estimatedAnnualIncomeCAD / 12,
          finalShares: shares,
          finalValue: finalAssetValueCAD
        });
      }

      const chartData = Object.values(timeline).filter(t => t.totalValue > 0);
      const finalValue = chartData.length > 0 ? chartData[chartData.length - 1].totalValue : initialAmount;
      const totalGrowth = ((finalValue - initialAmount) / initialAmount) * 100;
      
      const portfolioYield = finalValue > 0 ? (totalAnnualIncome / finalValue) * 100 : 0;
      const yieldOnCost = (totalAnnualIncome / initialAmount) * 100;
      // Note: periodYears was passed in req.body
      const annualizedReturn = (Math.pow(finalValue / initialAmount, 1 / periodYears) - 1) * 100;

      res.json({
        chartData,
        summary: {
          initialAmount,
          finalValue,
          totalGrowth,
          totalDividendsCollected,
          totalAnnualIncome,
          portfolioYield,
          yieldOnCost,
          annualizedReturn
        },
        holdingsStats,
        missingDataAssets
      });

    } catch (error) {
      console.error("Error simulating portfolio:", error);
      res.status(500).json({ error: 'Failed to simulate portfolio' });
    }
  });

  app.get("/api/substack", async (req, res) => {
    try {
      const feed = await parser.parseURL('https://arthanomy.substack.com/feed');
      res.json(feed);
    } catch (error) {
      console.error("Error fetching Substack RSS:", error);
      res.status(500).json({ error: 'Failed to fetch Substack data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
