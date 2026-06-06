import { LLMUsage, LLMUsageSchema } from '../../models/index.js';
import { BaseRepository, OperationType } from './BaseRepository.js';
import { logger } from '../../lib/logger.js';
import { logMappedError } from '../../lib/errorMapper.js';

export class UsageRepository extends BaseRepository<LLMUsage> {
  constructor() {
    super('llm_usage', LLMUsageSchema);
  }

  /**
   * Logs LLM usage. Detects if running on server (Node.js) to use Firebase Admin
   * or client to use standard BaseRepository logic.
   */
  async logUsage(usage: Omit<LLMUsage, 'id' | 'timestamp'>): Promise<string> {
    const isServer = typeof window === 'undefined';

    if (isServer) {
      try {
        const { getAdminFirestore } = await import('../../server/firebaseAdmin.js');
        const db = getAdminFirestore();
        if (db) {
          const docRef = await db.collection('llm_usage').add({
            ...usage,
            timestamp: new Date().toISOString()
          });
          return docRef.id;
        } else {
          logger.warn('UsageRepository: Firebase Admin Firestore não pôde ser iniciado por falta de credenciais (servidor)');
        }
      } catch (error) {
        logMappedError(error, 'usage:logUsage:server', { path: 'llm_usage', userId: usage.userId });
      }
      return '';
    }

    // Fallback para logic de BaseRepository (Cliente)
    try {
      return await this.create({
        ...usage,
        timestamp: new Date().toISOString()
      } as any, usage.userId);
    } catch (error) {
      logMappedError(error, 'usage:logUsage:client', { path: 'llm_usage', userId: usage.userId });
      return '';
    }
  }
}

export const usageRepository = new UsageRepository();
