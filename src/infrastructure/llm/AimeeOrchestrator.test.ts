import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AimeeOrchestrator } from './AimeeOrchestrator.js';

vi.mock('../../lib/config.js', () => ({
  config: {
    geminiApiKey: 'gemini-key',
    openaiApiKey: 'openai-key',
    deepseekApiKey: 'deepseek-key',
    firebase: {
      apiKey: 'test-key',
      authDomain: 'test-domain',
      projectId: 'test-project',
      storageBucket: 'test-bucket',
      messagingSenderId: 'test-id',
      appId: 'test-app'
    }
  }
}));

vi.mock('../repositories/UsageRepository.js', () => ({
  usageRepository: {
    logUsage: vi.fn().mockResolvedValue('audit-id')
  }
}));

vi.mock('../../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock Adapters
vi.mock('./GeminiAdapter.js', () => ({
  GeminiAdapter: vi.fn().mockImplementation(function() {
    return {
      id: 'gemini',
      isAvailable: () => true,
      generateResponse: vi.fn().mockResolvedValue({ content: 'Gemini Response', provider: 'gemini' })
    };
  })
}));

vi.mock('./OpenAICompatibleAdapter.js', () => ({
  OpenAICompatibleAdapter: vi.fn().mockImplementation(function(id) {
    return {
      id,
      isAvailable: () => true,
      generateResponse: vi.fn().mockResolvedValue({ content: `${id} Response`, provider: id })
    };
  })
}));

describe('AimeeOrchestrator', () => {
  let orchestrator: AimeeOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = new AimeeOrchestrator();
  });

  it('should list available providers in health check', async () => {
    const health = await orchestrator.checkHealth();
    expect(health.providers).toContain('gemini');
    expect(health.providers).toContain('deepseek');
    expect(health.providers).toContain('openai');
  });

  it('should try providers in order (Gemini first by default)', async () => {
    const response = await orchestrator.processRequest('Oi');
    expect(response.content).toBe('Gemini Response');
  });

  it('should respect preferred provider', async () => {
    const response = await orchestrator.processRequest('Oi', [], 'funny', undefined, 'deepseek');
    expect(response.content).toBe('deepseek Response');
  });
});
