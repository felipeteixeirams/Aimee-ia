import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAICompatibleAdapter } from './OpenAICompatibleAdapter.js';

const mockCreate = vi.fn();

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(function() {
      return {
        chat: {
          completions: {
            create: mockCreate
          }
        }
      };
    })
  };
});

describe('OpenAICompatibleAdapter', () => {
  let adapter: OpenAICompatibleAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new OpenAICompatibleAdapter('deepseek', 'test-key', 'https://api.deepseek.com', 'deepseek-chat');
  });

  it('should be available when api key is provided', () => {
    expect(adapter.isAvailable()).toBe(true);
  });

  it('should generate response using OpenAI SDK', async () => {
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: 'Resposta DeepSeek',
          tool_calls: []
        }
      }]
    });

    const response = await adapter.generateResponse({
      prompt: 'Teste',
      history: [],
      persona: 'funny'
    });

    expect(response.content).toBe('Resposta DeepSeek');
    expect(response.provider).toBe('deepseek');
  });

  it('should handle tool calls correctly', async () => {
    mockCreate.mockResolvedValue({
      choices: [{
        message: {
          content: '',
          tool_calls: [{
            type: 'function',
            function: {
              name: 'addTransaction',
              arguments: JSON.stringify({ amount: 100 })
            }
          }]
        }
      }]
    });

    const response = await adapter.generateResponse({
      prompt: 'Gastei 100',
      history: [],
      persona: 'analytical',
      tools: [{ name: 'addTransaction', description: 'desc', parameters: {} }]
    });

    expect(response.functionCalls).toHaveLength(1);
    expect(response.functionCalls?.[0].name).toBe('addTransaction');
    expect(response.functionCalls?.[0].args.amount).toBe(100);
  });
});
