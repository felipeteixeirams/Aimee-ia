import "reflect-metadata";
import { fileURLToPath } from "url";
import path from "path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import middie from "@fastify/middie";
import { logger } from "../src/lib/logger.js";
import { validateConfig } from "../src/lib/config.js";
import { requestLogger, globalErrorHandler } from "../src/infrastructure/server/middlewares.js";
import apiRoutes from "../src/infrastructure/server/routes.js";

// Initialize config - move inside startServer for better cold boot handling if needed
// but validateConfig is safe to run once at module level
validateConfig();

const startServer = async () => {
  const fastify = Fastify({
    logger: false,
    disableRequestLogging: true
  });

  await fastify.register(cors);
  await fastify.register(middie);
  
  fastify.addHook('preHandler', requestLogger);
  fastify.setErrorHandler(globalErrorHandler);

  // API Routes
  await fastify.register(apiRoutes, { prefix: "/api" });

  await fastify.ready();
  return fastify;
};

let fastifyInstance: any = null;

export default async (req: any, res: any) => {
  try {
    if (!fastifyInstance) {
      fastifyInstance = await startServer();
    }
    fastifyInstance.server.emit('request', req, res);
  } catch (error: any) {
    console.error("CRITICAL: Vercel Function Failed to Initialize", error);
    res.statusCode = 500;
    res.end(JSON.stringify({ 
      error: "Vercel Function Error", 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }));
  }
};
