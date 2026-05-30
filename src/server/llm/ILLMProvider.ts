export interface LLMRequest {
  prompt: string;
  history: any[];
  persona: string;
  tools?: any[];
}

export interface LLMResponse {
  content: string;
  functionCalls?: any[];
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    model: string;
  };
}

export interface ILLMProvider {
  id: string;
  isAvailable(): boolean;
  generateResponse(request: LLMRequest): Promise<LLMResponse>;
}
