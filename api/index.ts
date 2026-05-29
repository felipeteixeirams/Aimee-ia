import "reflect-metadata";
import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import middie from "@fastify/middie";

// Use lazy imports to catch initialization errors
let fastifyInstance: FastifyInstance | null = null;

async function initServer() {
  try {
    console.log("Starting initialization of Aimee AI Backend...");
    
    // Dynamically import everything to capture evaluation errors
    const { logger } = await import("../src/lib/logger.js");
    const { validateConfig } = await import("../src/lib/config.js");
    const { requestLogger, globalErrorHandler } = await import("../src/server/middlewares.js");
    const { default: apiRoutes } = await import("../src/server/routes.js");
    const { container } = await import("../src/server/container.js");
    const { AimeeOrchestrator } = await import("../src/server/llm/AimeeOrchestrator.js");

    validateConfig();

    const fastify = await (import("fastify") as any).then((m: any) => m.default({
      logger: false,
      disableRequestLogging: true
    }));

    await fastify.register(cors);
    await fastify.register(middie);
    
    fastify.addHook('preHandler', requestLogger);
    fastify.setErrorHandler(globalErrorHandler);

    // API Routes
    await fastify.register(apiRoutes, { prefix: "/api" });

    await fastify.ready();
    console.log("Aimee AI Backend initialized successfully");
    return fastify;
  } catch (err: any) {
    console.error("FATAL INITIALIZATION ERROR:", err);
    throw err;
  }
}

export default async (req: any, res: any) => {
  try {
    if (!fastifyInstance) {
      fastifyInstance = await initServer();
    }
    fastifyInstance.server.emit('request', req, res);
  } catch (error: any) {
    console.error("CRITICAL: Vercel Function Execution Failed", {
      message: error.message,
      stack: error.stack
    });
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      error: "Vercel Function Error", 
      message: error.message,
      context: "Initialization Failure"
    }));
  }
};
