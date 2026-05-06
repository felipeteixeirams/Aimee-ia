import { fileURLToPath } from "url";
import path from "path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import middie from "@fastify/middie";
import { logger } from "../src/lib/logger";
import { validateConfig } from "../src/lib/config";
import { requestLogger, globalErrorHandler } from "../src/infrastructure/server/middlewares";
import apiRoutes from "../src/infrastructure/server/routes";

// Initialize config
validateConfig();

const startServer = async () => {
  const fastify = Fastify({
    logger: false,
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

const serverPromise = startServer();

export default async (req: any, res: any) => {
  const fastify = await serverPromise;
  fastify.server.emit('request', req, res);
};
