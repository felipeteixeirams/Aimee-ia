import "reflect-metadata";
import { singleton, container } from "tsyringe";
import { logger } from "../../lib/logger.js";
import { allAimeeTools } from "../tools/AimeeTools.js";
import { config } from "../../lib/config.js";
import { ILLMProvider, LLMRequest, LLMResponse } from "./ILLMProvider.js";
import { GeminiAdapter } from "./GeminiAdapter.js";
import { DeepSeekAdapter } from "./DeepSeekAdapter.js";
import { OpenAICompatibleAdapter } from "./OpenAICompatibleAdapter.js";
import { usageRepository } from "../repositories/UsageRepository.js";
import { LRUCache } from "lru-cache";

@singleton()
export class AimeeOrchestrator {
  private providers: Map<string, ILLMProvider> = new Map();
  private cache = new LRUCache<string, { content: string; usage: any }>({
    max: 100, // Armazena até 100 respostas
    ttl: 1000 * 60 * 5, // 5 minutos de cache
  });

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    const gemini = new GeminiAdapter();
    if (gemini.isAvailable()) this.providers.set('gemini', gemini);

    const deepseek = new DeepSeekAdapter();
    if (deepseek.isAvailable()) this.providers.set('deepseek', deepseek);

    const openai = new OpenAICompatibleAdapter(
      'openai',
      config.openaiApiKey,
      "https://api.openai.com/v1",
      "gpt-4o"
    );
    if (openai.isAvailable()) this.providers.set('openai', openai);
  }

  async checkHealth(): Promise<{ providers: string[]; ok: boolean }> {
    const available = Array.from(this.providers.values())
      .filter(p => p.isAvailable())
      .map(p => p.id);

    return {
      providers: available,
      ok: available.length > 0
    };
  }

  async processRequest(
    prompt: string, 
    history: any[] = [], 
    persona: string = "funny", 
    audio?: { data: string; mimeType: string }, 
    preferredProvider?: string,
    userId: string = 'system',
    contextType: string = 'chat',
    context: any = {}
  ): Promise<{ content: string; functionCalls?: any[]; usage?: any }> {
    
    // Build contextual prompt enrichment
    const tasks = context.tasks || [];
    const finance = context.finance || [];
    const shopping = context.shopping || [];
    const goals = context.goals || [];

    const contextString = `
[DADOS DO USUÁRIO]
- Tarefas Pendentes: ${tasks.length} ativas.
- Transações Recentes: ${finance.length} registradas.
- Itens na Lista de Compras: ${shopping.length} pendentes.
- Metas Financeiras: ${goals.length || 0} em progresso.

Histórico de Dados (JSON):
${JSON.stringify({ tasks: tasks.slice(0, 10), finance: finance.slice(0, 10), shopping: shopping.slice(0, 10) })}
`;

    const finalPrompt = `${prompt}\n\n${contextString}`;
    
    // Check Cache first (only for simple requests)
    const cacheKey = JSON.stringify({ prompt: finalPrompt, history, persona, preferredProvider });
    if (!audio && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      logger.info('Orchestrator: Cache hit!', { prompt: prompt.substring(0, 30) });
      return { 
        content: cached.content, 
        usage: { ...cached.usage, cached: true } 
      };
    }

    const providersToTry = this.getOrderedProviders(preferredProvider);

    if (providersToTry.length === 0) {
      throw new Error("Nenhum provedor de IA disponível e configurado.");
    }

    let lastError: any = null;

    for (const providerId of providersToTry) {
      const provider = this.providers.get(providerId);
      if (!provider) continue;

      try {
        logger.info(`Orchestrator: Tentando ${providerId}`);
        
        const request: LLMRequest = {
          prompt: finalPrompt,
          history: this.normalizeHistory(history),
          persona,
          tools: allAimeeTools
        };

        const response: LLMResponse = await provider.generateResponse(request);
        
        // Cache successful text-only responses
        if (!response.functionCalls || response.functionCalls.length === 0) {
          const cacheKey = JSON.stringify({ prompt, history, persona, preferredProvider });
          this.cache.set(cacheKey, { 
            content: response.content, 
            usage: response.usage 
          });
        }

        // Audit usage
        usageRepository.logUsage({
          userId,
          model: response.usage?.model || providerId,
          promptTokens: response.usage?.promptTokens || 0,
          completionTokens: response.usage?.completionTokens || 0,
          totalTokens: response.usage?.totalTokens || 0,
          context: contextType
        }).catch(err => logger.error('Falha ao registrar auditoria de tokens via Repository', { err }));

        return {
          content: response.content,
          functionCalls: response.functionCalls,
          usage: response.usage
        };
      } catch (error: any) {
        lastError = error;
        logger.warn(`Orchestrator: Falha em ${providerId}.`, { error: error.message });
      }
    }

    throw lastError || new Error("Falha ao processar com todos os provedores.");
  }

  private getOrderedProviders(preferred?: string): string[] {
    const order = new Set<string>();
    
    if (preferred && this.providers.has(preferred)) {
      order.add(preferred);
    }

    // Default priority: Gemini -> DeepSeek -> OpenAI
    ['gemini', 'deepseek', 'openai'].forEach(id => {
      if (this.providers.has(id)) order.add(id);
    });

    return Array.from(order);
  }

  private normalizeHistory(history: any[]): any[] {
    return history.map(h => ({
      role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
      content: typeof h.parts?.[0]?.text === 'string' ? h.parts[0].text : (h.content || "")
    }));
  }
}
