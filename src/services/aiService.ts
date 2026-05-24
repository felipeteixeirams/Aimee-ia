import { ChatMessage, FinancialGoal, HouseholdTask, FamilyEvent, ShoppingItem, Transaction } from "../types/index.js";
import { logger } from "../lib/logger.js";

/**
 * Aimee Client Orchestrator
 * This is now a lightweight proxy that routes all intelligence requests to the secure backend.
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
  
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })).slice(-10),
        persona,
        provider,
        userId: activeUserId,
        contextType,
        context: {
          tasks,
          finance: transactions,
          shopping: shoppingList,
          goals,
          events
        },
        audio
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Erro na comunicação com o servidor de IA");
    }

    const data = await response.json();
    const content = data.content || "";
    const functionCalls = data.functionCalls;

    // We keep the tool execution on the client for now because the repositories are client-side 
    // and this ensures reactive UI updates via Firebase listeners.
    let feedback = "";
    if (functionCalls && functionCalls.length > 0) {
      const { financeSkill, routineSkill, shoppingSkill } = await import("../domain/skills/index.js");
      
      for (const call of functionCalls) {
        const name = call.name;
        const args = (call.args || {}) as any;

        try {
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
        } catch (toolErr) {
          logger.error(`Erro ao executar ferramenta ${name}`, { toolErr });
        }
      }
    }

    return (feedback ? `${feedback}\n\n${content}` : content) || "Comando processado.";
  } catch (error: any) {
    logger.error("Aimee Client Orchestrator Error:", error);
    return `Desculpe, tive um problema técnico: ${error.message}`;
  }
};

export const checkAIHealth = async (provider: 'gemini' | 'deepseek'): Promise<{ ok: boolean; error?: string }> => {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    return { ok: data.status === 'healthy' };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
