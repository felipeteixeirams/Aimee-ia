import { ChatMessage, FinancialGoal, HouseholdTask, FamilyEvent, ShoppingItem, Transaction } from "../types/index.js";
import { 
  financeSkill,
  routineSkill,
  shoppingSkill
} from "../domain/skills/index.js";
import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { allAimeeTools } from "../infrastructure/tools/AimeeTools.js";
import { withRetry } from "../lib/retryUtils.js";
import { config } from "../lib/config.js";
import { usageRepository } from "../infrastructure/repositories/UsageRepository.js";
import { logger } from "../lib/logger.js";
import { getAimeeSystemInstruction } from "../domain/intelligence/AimeePrompts.js";

// Initialize AI on frontend
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();

// Only use direct Frontend AI if specifically configured
const isValidKey = (key?: string) => key && key.length > 20 && !key.includes('your-');
const genAI = isValidKey(geminiApiKey) ? new GoogleGenAI({ apiKey: geminiApiKey! }) : null;

if (!genAI) {
  console.log('[AimeeClient] API Key de Frontend ausente ou inválida. Operando via Backend somente.');
}

/**
 * Aimee Client Orchestrator
 * Coordena a inteligência local (Gemini) e remota (Backend/DeepSeek)
 */
export const aimeeClientOrchestrator = async (
  prompt: string, 
  history: ChatMessage[], 
  userId: string, 
  shoppingList: ShoppingItem[], 
  transactions: Transaction[],
  goals: FinancialGoal[] = [],
  tasks: HouseholdTask[] = [],
  events: FamilyEvent[] = [],
  persona: string = 'funny', 
  provider: 'gemini' | 'deepseek' = 'gemini',
  targetUserId?: string,
  audio?: { data: string; mimeType: string },
  contextType: string = 'chat'
) => {
  const activeUserId = targetUserId || userId;
  
  const callAI = async () => {
    // 1. Roteamento para o Backend (Provedores Externos ou Fallback)
    if (provider !== 'gemini' || !genAI) {
      console.log(`[AimeeClient] Roteando para o backend (Provedor: ${provider})`);
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          history: history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })).slice(-10),
          persona,
          provider,
          userId: activeUserId,
          contextType,
          context: {
            tasks: tasks.slice(0, 10),
            finance: transactions.slice(0, 10),
            shopping: shoppingList.slice(0, 10)
          },
          audio
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro na comunicação com o servidor de IA");
      }

      const data = await response.json();
      return {
        content: data.content || "",
        functionCalls: data.functionCalls
      };
    }

    // 2. Execução Local (Gemini Frontend)
    console.log(`[AimeeClient] Executando Gemini localmente...`);
    try {
      const contextString = `
[CONTEXTO ATUAL]
Tarefas: ${JSON.stringify(tasks.slice(0, 5))}
Finanças: ${JSON.stringify(transactions.slice(0, 5))}
Compras: ${JSON.stringify(shoppingList.slice(0, 5))}
`;
      
      const fullPrompt = `${prompt}\n\n${contextString}`;
      const formattedHistory = history.map(msg => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.content }]
      })).slice(-10);

      const parts: any[] = [{ text: fullPrompt }];
      if (audio) {
        parts.push({
          inlineData: {
            data: audio.data,
            mimeType: audio.mimeType
          }
        });
      }

      const response: GenerateContentResponse = await genAI.models.generateContent({
        model: "gemini-flash-latest",
        contents: [
          ...formattedHistory,
          { role: "user", parts }
        ],
        config: {
          systemInstruction: getAimeeSystemInstruction(persona, new Date().toLocaleString()),
          tools: [{ functionDeclarations: allAimeeTools } as any]
        }
      });

      if (response.usageMetadata) {
        usageRepository.logUsage({
          userId: activeUserId,
          model: "gemini-flash-latest",
          promptTokens: response.usageMetadata.promptTokenCount || 0,
          completionTokens: response.usageMetadata.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata.totalTokenCount || 0,
          context: contextType
        }).catch(err => logger.error('Falha ao registrar auditoria de tokens', { err }));
      }

      return {
        content: response.text || "",
        functionCalls: response.functionCalls
      };
    } catch (err: any) {
      console.warn(`[AimeeClient] Falha local, tentando backend como fallback...`, err);
      // Fallback automático para o backend
      provider = 'deepseek' as any; 
      return callAI(); 
    }
  };

  try {
    const { content, functionCalls } = await withRetry(callAI, { maxAttempts: 2 });

    let feedback = "";
    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls) {
        const name = call.name;
        const args = (call.args || {}) as any;

        if (name === 'addTransaction') {
           await financeSkill.recordTransaction(activeUserId, args);
           feedback += `✅ Registrado: ${args.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${Number(args.amount || 0).toFixed(2)}. `;
        }
        
        if (name === 'addShoppingItems') {
          await shoppingSkill.addItems(activeUserId, args.items);
          feedback += `🛒 Itens adicionados à lista. `;
        }

        if (name === 'addHouseholdTask') {
          await routineSkill.addTask(activeUserId, args);
          feedback += `🧹 Tarefa criada: ${args.title}. `;
        }
        
        if (name === 'addFamilyEvent') {
          await routineSkill.addEvent(activeUserId, args);
          feedback += `📅 Evento agendado: ${args.title}. `;
        }

        if (name === 'updateHouseholdTask') {
          await routineSkill.updateTask(activeUserId, String(args.id), args);
          feedback += `🧹 Tarefa atualizada. `;
        }

        if (name === 'removeFamilyEvent') {
          await routineSkill.removeEvent(activeUserId, String(args.id));
          feedback += `📅 Evento removido. `;
        }

        if (name === 'updateFamilyEvent') {
          await routineSkill.updateEvent(activeUserId, String(args.id), args);
          feedback += `📅 Evento atualizado. `;
        }
      }
    }

    return (feedback ? `${feedback}\n\n${content}` : content) || "Comando processado.";
  } catch (error: any) {
    console.error("Aimee Client Orchestrator Error:", error);
    return `Desculpe, tive um problema técnico: ${error.message}`;
  }
};

export const checkAIHealth = async (provider: 'gemini' | 'deepseek'): Promise<{ ok: boolean; error?: string }> => {
  if (provider === 'gemini') {
    return { ok: !!genAI };
  }
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    return { ok: data.status === 'healthy' };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
