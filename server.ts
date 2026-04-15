import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Parser from "rss-parser";
import dotenv from "dotenv";

dotenv.config();

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator', 'enclosure']
  }
});

// In-memory cache for EODHD data
const financeCache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/finance/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      
      // Check cache first
      const cached = financeCache[ticker];
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION_MS)) {
        console.log(`Serving ${ticker} from cache`);
        return res.json(cached.data);
      }

      // Use provided EODHD API key or fallback to environment variable
      const apiKey = process.env.EODHD_API_KEY || '69d130ed80cb06.53146782';
      
      if (!apiKey) {
        throw new Error("EODHD_API_KEY is not set");
      }

      // Fetch 5 years of monthly data from EODHD
      // Calculate start date 5 years ago
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);
      const startDateStr = startDate.toISOString().split('T')[0];

      const response = await fetch(`https://eodhd.com/api/eod/${ticker}?api_token=${apiKey}&fmt=json&from=${startDateStr}&period=m`);
      
      if (!response.ok) {
        throw new Error(`EODHD API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Save to cache
      financeCache[ticker] = {
        data,
        timestamp: Date.now()
      };
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching EODHD data:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch data' });
    }
  });

  app.get("/api/substack", async (req, res) => {
    try {
      // Using Net Interest as a placeholder popular finance substack
      const feed = await parser.parseURL('https://netinterest.substack.com/feed');
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
