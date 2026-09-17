import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Warm API route for backend health confirmation
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Serve static assets from public directory directly
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // Integrated Vite Middleware for streamlined local development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Assets Serving with catch-all routing to serve index.html for SPAs
    const distPath = path.join(process.cwd(), 'dist');

    // Helper to serve index.html with absolute no-cache headers to guarantee live updates
    const serveIndexWithoutCache = (req: express.Request, res: express.Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      res.sendFile(path.join(distPath, 'index.html'));
    };

    // Explicitly handle root and index.html routes first
    app.get('/', serveIndexWithoutCache);
    app.get('/index.html', serveIndexWithoutCache);

    // Serve all static assets (like images, JS, CSS files) with standard caching
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // If the asset is part of Vite's compiled hashes (inside assets folder), it is immutable
        if (filePath.includes('/assets/') || filePath.match(/\.[a-f0-9]{8,16}\./)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      }
    }));

    // SPA catch-all fallback using our no-cache handler
    app.get('*', serveIndexWithoutCache);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Alhamd Fabrics Server] running on http://localhost:${PORT}`);
  });
}

startServer();
