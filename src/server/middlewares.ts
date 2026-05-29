import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import { z, ZodTypeAny } from 'zod';
import { logger } from '../lib/logger.js';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: FastifyRequest) => {
    try {
      await schema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw {
          statusCode: 400,
          error: "Erro de validação",
          details: error.issues.map(e => ({ path: e.path, message: e.message }))
        };
      }
      throw error;
    }
  };
};

export const requestLogger = async (req: FastifyRequest, reply: FastifyReply) => {
  const start = Date.now();
  
  reply.raw.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
};

export const globalErrorHandler = (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  const statusCode = error.statusCode || 500;
  
  logger.error('Server Error', {
    error: error.message,
    statusCode,
    path: req.url,
    method: req.method,
    stack: error.stack
  });

  reply.status(statusCode).send({
    error: statusCode === 500 ? "Internal Server Error" : error.message,
    details: (error as any).details
  });
};
