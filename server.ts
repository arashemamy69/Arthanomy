import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'creator', 'enclosure']
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/finance/:ticker", async (req, res) => {
    try {
      const { ticker } = req.params;
      // Fetch 5 years of monthly data
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=5y&interval=1mo`);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching Yahoo Finance data:", error);
      res.status(500).json({ error: 'Failed to fetch data' });
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
