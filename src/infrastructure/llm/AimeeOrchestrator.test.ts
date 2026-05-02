import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AimeeOrchestrator } from './AimeeOrchestrator';

// Mock dependencies
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  const MockType = {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
    NUMBER: 'NUMBER',
    BOOLEAN: 'BOOLEAN',
    ARRAY: 'ARRAY'
  };
  
  return {
    GoogleGenAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: vi.fn().mockReturnValue({
          generateContent: mockGenerateContent
        })
      };
    }),
    Type: MockType
  };
});

vi.mock('../../lib/logger.ts', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('AimeeOrchestrator', () => {
  let orchestrator: AimeeOrchestrator;
  const API_KEY = 'test-key';

  beforeEach(() => {
    vi.clearAllMocks();
    orchestrator = new AimeeOrchestrator(API_KEY);
  });

  it('should format message and return content', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Olá do Gemini!',
        candidates: [{ content: { parts: [] } }]
      }
    });

    const response = await orchestrator.processRequest('Olá', [], 'funny');

    expect(response.content).toBe('Olá do Gemini!');
  });

  it('should include history in the request', async () => {
    mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'R: Oi',
          candidates: [{ content: { parts: [] } }]
        }
      });
    const history = [{ role: 'user', parts: [{ text: 'Oi' }] }, { role: 'model', parts: [{ text: 'Olá' }] }];
    
    await orchestrator.processRequest('Como vai?', history);

    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
      contents: [
        ...history,
        { role: 'user', parts: [{ text: 'Como vai?' }] }
      ]
    }));
  });

  it('should handle audio data correctly', async () => {
    mockGenerateContent.mockResolvedValue({
        response: {
          text: () => 'Transcrito',
          candidates: [{ content: { parts: [] } }]
        }
      });
    const audio = { data: 'base64-string', mimeType: 'audio/webm' };

    await orchestrator.processRequest('Processa este áudio', [], 'analytical', audio);

    expect(mockGenerateContent).toHaveBeenCalledWith(expect.objectContaining({
        contents: [
          { 
            role: 'user', 
            parts: [
              { text: 'Processa este áudio' },
              { inlineData: { data: 'base64-string', mimeType: 'audio/webm' } }
            ] 
          }
        ]
      }));
  });

  it('should throw and log on errors', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API Down'));
    
    await expect(orchestrator.processRequest('Teste'))
      .rejects.toThrow('API Down');
  });

  it('should handle function calls in response', async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Ações necessárias',
        candidates: [{ 
          content: { 
            parts: [
              { functionCall: { name: 'addTransaction', args: { amount: 10 } } }
            ] 
          } 
        }]
      }
    });

    const response = await orchestrator.processRequest('Gastei 10');

    expect(response.functionCalls).toHaveLength(1);
    expect(response.functionCalls?.[0].name).toBe('addTransaction');
  });

  describe('systemInstruction', () => {
    it('should include correct persona instructions', async () => {
        mockGenerateContent.mockResolvedValue({ 
          response: { 
            text: () => 'ok',
            candidates: [{ content: { parts: [] } }]
          } 
        });
        
        await orchestrator.processRequest('X', [], 'frugal');
    });

    it('should fallback to funny persona if unknown', async () => {
      mockGenerateContent.mockResolvedValue({ 
        response: { 
          text: () => 'ok',
          candidates: [{ content: { parts: [] } }]
        } 
      });
      
      await orchestrator.processRequest('X', [], 'unknown-persona' as any);
    });
  });
});
