import { ILLMProvider, LLMRequest, LLMResponse } from "./ILLMProvider.js";
import { config } from "../../lib/config.js";
import { GoogleGenAI } from "@google/genai";
import { getAimeeSystemInstruction } from "../../domain/intelligence/AimeePrompts.js";

export class GeminiAdapter implements ILLMProvider {
  public id = 'gemini';
  private genAI?: GoogleGenAI;

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

    const formattedHistory = request.history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const parts = [{ text: request.prompt }];

    const response = await this.genAI.models.generateContent({
      model: "gemini-flash-latest",
      contents: [...formattedHistory, { role: 'user', parts }],
      config: {
        systemInstruction: getAimeeSystemInstruction(request.persona, new Date().toLocaleString()),
        tools: request.tools ? [{ functionDeclarations: request.tools }] : undefined
      }
    });

    const functionCalls = response.functionCalls?.map(fc => ({
      name: fc.name,
      args: fc.args
    }));

    return {
      content: response.text || "",
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
