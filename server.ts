import "reflect-metadata";
import Fastify from "fastify";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import middie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { logger } from "./src/lib/logger.js";
import { validateConfig } from "./src/lib/config.js";
import { requestLogger, globalErrorHandler } from "./src/infrastructure/server/middlewares.js";
import apiRoutes from "./src/infrastructure/server/routes.js";

dotenv.config();

// Centralized configuration and validation
validateConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const fastify = Fastify({
    logger: false, // Usamos nosso próprio logger
  });

  // 1. Plugins & Core Middlewares
  await fastify.register(cors);
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (req, context) => ({
      error: "Muitas requisições",
      message: `Limite de requisições excedido. Tente novamente em ${context.after}.`
    })
  });
  await fastify.register(middie);
  
  fastify.addHook('preHandler', requestLogger);
  fastify.setErrorHandler(globalErrorHandler);

  // 2. API Routes
  await fastify.register(apiRoutes, { prefix: "/api" });

  // 3. Vite / Static Files Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Usamos middie para integrar o middleware do Vite
    await fastify.use(vite.middlewares);
  } else {
    // Em produção servimos os arquivos de dist
    const clientPath = path.join(process.cwd(), "dist");
    
    await fastify.register(fastifyStatic, {
      root: clientPath,
      prefix: '/',
    });

    // Fallback para SPA (index.html em qualquer rota não-API)
    fastify.setNotFoundHandler(async (req, reply) => {
      if (req.url.startsWith('/api')) {
        reply.status(404).send({ error: "API Route Not Found" });
        return;
      }
      return reply.sendFile('index.html');
    });
  }

  return fastify;
}

const serverPromise = startServer();

// Inicia o listener apenas se não estiver em ambiente serverless (Vercel)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  serverPromise.then(async (fastify) => {
    const PORT = Number(process.env.PORT) || 3000;
    try {
      await fastify.listen({ port: PORT, host: "0.0.0.0" });
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode`, {
        port: PORT,
        host: "0.0.0.0"
      });
      console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
      logger.error("Failed to start server", { error: err });
      process.exit(1);
    }
  });
}

// Adaptador para Vercel (Fastify expõe a instância como um listener padrão de HTTP)
export default async (req: any, res: any) => {
  const fastify = await serverPromise;
  await fastify.ready();
  fastify.server.emit('request', req, res);
};
