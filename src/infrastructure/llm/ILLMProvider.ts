import { ChatMessage } from "../../types";

export interface LLMRequest {
  prompt: string;
  history: ChatMessage[];
  persona: string;
  context?: string;
  tools?: any[];
}

export interface LLMResponse {
  content: string;
  functionCalls?: Array<{
    name: string;
    args: any;
  }>;
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
