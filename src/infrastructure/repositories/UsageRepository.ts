import { BaseRepository } from './BaseRepository.js';
import { LLMUsage } from '../../models/index.js';
import { LLMUsageSchema } from '../../models/index.js';

export class UsageRepository extends BaseRepository<LLMUsage> {
  constructor() {
    super('llm_usage', LLMUsageSchema);
  }

  // Override create to handle the fact that llm_usage is a top-level collection
  // and we don't want to enforce {userId} in the path but we want to store it in data.
  async logUsage(usage: Omit<LLMUsage, 'id' | 'timestamp'>): Promise<string> {
    return this.create({
      ...usage,
      timestamp: new Date().toISOString()
    } as any, usage.userId);
  }
}

export const usageRepository = new UsageRepository();
