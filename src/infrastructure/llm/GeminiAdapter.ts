import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ILLMProvider, LLMRequest, LLMResponse } from "./ILLMProvider.js";
import { config } from "../../lib/config.js";
import { logger } from "../../lib/logger.js";
import { getAimeeSystemInstruction } from "../../domain/intelligence/AimeePrompts.js";

export class GeminiAdapter implements ILLMProvider {
  readonly id = 'gemini';
  private genAI: any;

  constructor() {
    if (config.geminiApiKey) {
      this.genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  isAvailable(): boolean {
    return !!this.genAI && !!config.geminiApiKey;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.genAI) throw new Error("Gemini API Key não configurada.");

    const model = this.genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: getAimeeSystemInstruction(request.persona, new Date().toLocaleString())
    });

    const formattedHistory = request.history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const parts: any[] = [{ text: request.prompt }];
    
    // In Gemini SDK tool definition is handled slightly differently in higher level API, 
    // but here we follow the same pattern used in Orchestrator previously
    const result = await model.generateContent({
      contents: [...formattedHistory, { role: 'user', parts }],
      tools: request.tools ? [{ functionDeclarations: request.tools }] : []
    });

    const response = await result.response;
    const functionCalls = response.functionCalls()?.map((fc: any) => ({
      name: fc.name,
      args: fc.args
    }));

    return {
      content: response.text(),
      functionCalls,
      provider: this.id,
      usage: response.usageMetadata ? {
        promptTokens: response.usageMetadata.promptTokenCount || 0,
        completionTokens: response.usageMetadata.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata.totalTokenCount || 0,
        model: "gemini-flash-latest"
      } : undefined
    };
  }
}
