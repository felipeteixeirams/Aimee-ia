import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { logger } from "./src/lib/logger.ts";
import { validateConfig } from "./src/lib/config.ts";
import { requestLogger, globalErrorHandler } from "./src/infrastructure/server/middlewares.ts";
import apiRoutes from "./src/infrastructure/server/routes.ts";

dotenv.config();

// Centralized configuration and validation
validateConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // 1. Core Middlewares
  app.use(express.json());
  app.use(requestLogger);

  // 2. API Routes
  app.use("/api", apiRoutes);

  // 3. Vite / Static Files Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Em produção, o servidor compilado está em dist/, e o front em dist/client/
    const clientPath = path.join(__dirname, "client");
    app.use(express.static(clientPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientPath, "index.html"));
    });
  }

  // 4. Global Error Handling (Must be last)
  app.use(globalErrorHandler);

  return app;
}

const appPromise = startServer();

// Inicia o listener apenas se não estiver em ambiente serverless (Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  appPromise.then(app => {
    const PORT = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode`, {
        port: PORT,
        host: "0.0.0.0"
      });
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

export default async (req: any, res: any) => {
  const app = await appPromise;
  return app(req, res);
};
