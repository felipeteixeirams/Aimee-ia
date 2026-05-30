import { ILLMProvider, LLMRequest, LLMResponse } from "./ILLMProvider.js";
import { getAimeeSystemInstruction } from "../../domain/intelligence/AimeePrompts.js";
import OpenAI from "openai";

export class OpenAICompatibleAdapter implements ILLMProvider {
  private client: OpenAI | null = null;

  constructor(
    public id: string,
    private apiKey: string,
    private baseURL: string,
    private modelName: string
  ) {
    if (apiKey) {
      this.client = new OpenAI({ apiKey, baseURL });
    }
  }

  isAvailable(): boolean {
    return !!this.client && !!this.apiKey;
  }

  async generateResponse(request: LLMRequest): Promise<LLMResponse> {
    if (!this.client) throw new Error(`${this.id} API Key não configurada.`);

    const systemMessage = {
      role: 'system' as const,
      content: getAimeeSystemInstruction(request.persona, new Date().toLocaleString())
    };

    const messages = [
      systemMessage,
      ...request.history.map(m => ({
        role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: m.content
      })),
      { role: 'user' as const, content: request.prompt }
    ];

    const tools = request.tools?.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: this.normalizeSchema(tool.parameters)
      }
    }));

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages,
      tools,
      tool_choice: "auto"
    });

    const choice = response.choices[0].message;
    const functionCalls = choice.tool_calls?.map(tc => {
      if (tc.type === 'function') {
        return {
          name: tc.function.name,
          args: JSON.parse(tc.function.arguments)
        };
      }
      return null;
    }).filter((f): f is { name: string; args: any } => !!f);

    return {
      content: choice.content || "",
      functionCalls,
      provider: this.id,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
        model: this.modelName
      } : undefined
    };
  }

  private normalizeSchema(schema: any): any {
    if (!schema || typeof schema !== 'object') return schema;
    const newSchema = { ...schema };
    if (typeof newSchema.type === 'string') newSchema.type = newSchema.type.toLowerCase();
    
    if (newSchema.properties) {
      const newProps: any = {};
      for (const [key, value] of Object.entries(newSchema.properties)) {
        newProps[key] = this.normalizeSchema(value);
      }
      newSchema.properties = newProps;
    }
    
    if (newSchema.items) newSchema.items = this.normalizeSchema(newSchema.items);
    return newSchema;
  }
}
