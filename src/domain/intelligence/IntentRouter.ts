import { AIProvider, ChatMessage } from "../../types/index.js";
import { logger } from "../../lib/logger.js";

export type AimeeIntent = 'finance' | 'shopping' | 'routine' | 'chat_general' | 'unknown';

export class IntentRouter {
  /**
   * Identifica a intenção do usuário sem processar a ação.
   */
  static async route(
    prompt: string, 
    history: ChatMessage[],
    provider: AIProvider = 'gemini'
  ): Promise<AimeeIntent> {
    const classificationPrompt = `
Classifique a intenção do usuário em apenas UMA das categorias abaixo:
- finance: se envolver gastos, ganhos, metas financeiras ou dinheiro.
- shopping: se envolver lista de compras, estoque de casa ou itens de mercado.
- routine: se envolver tarefas domésticas, calendário, eventos ou lembretes.
- chat_general: se for apenas saudação, conversa fiada ou pergunta geral.

Responda APENAS o nome da categoria em minúsculas (ex: finance).

Mensagem do Usuário: "${prompt}"
`;

    try {
      // Por enquanto, faremos uma classificação simples via backend ou gemini local
      // Idealmente aqui chamamos o orchestrator com um prompt de classificação
      // Mas para manter a "Arquitetura 2.0", vamos abstrair isso aqui.
      
      // Mock inicial ou heurística básica para economizar tokens se for óbvio
      const lowPrompt = prompt.toLowerCase();
      if (lowPrompt.includes('gastei') || lowPrompt.includes('ganhei') || lowPrompt.includes('dinheiro') || lowPrompt.includes('transação')) return 'finance';
      if (lowPrompt.includes('compra') || lowPrompt.includes('mercado') || lowPrompt.includes('lista') || lowPrompt.includes('fralda')) return 'shopping';
      if (lowPrompt.includes('tarefa') || lowPrompt.includes('agendar') || lowPrompt.includes('evento')) return 'routine';

      // Se não for óbvio, poderíamos chamar a LLM, mas por agora retornamos chat_general
      return 'chat_general';
    } catch (error) {
      logger.error('IntentRouter: Error identifying intent', { error });
      return 'unknown';
    }
  }
}
