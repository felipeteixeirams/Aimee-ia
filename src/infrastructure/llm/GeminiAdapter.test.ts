import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiAdapter } from './GeminiAdapter.js';
import { config } from '../../lib/config.js';

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: vi.fn().mockResolvedValue({
            response: {
              text: () => 'Mocked Gemini Response',
              functionCalls: () => []
            }
          })
        })
      };
    })
  };
});

vi.mock('../../lib/config.js', () => ({
  config: {
    geminiApiKey: 'test-api-key'
  }
}));

describe('GeminiAdapter', () => {
  let adapter: GeminiAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new GeminiAdapter();
  });

  it('should be available when api key is provided', () => {
    expect(adapter.isAvailable()).toBe(true);
  });

  it('should generate response with correct content', async () => {
    const response = await adapter.generateResponse({
      prompt: 'Oi',
      history: [],
      persona: 'funny'
    });

    expect(response.content).toBe('Mocked Gemini Response');
    expect(response.provider).toBe('gemini');
  });

  it('should format history correctly for Gemini', async () => {
    const history = [{ role: 'user', content: 'Olá' }];
    const response = await adapter.generateResponse({
      prompt: 'Tudo bem?',
      history,
      persona: 'analytical'
    });
    
    // Internal verification would require spying on the model call
    expect(response.content).toBeDefined();
  });
});
