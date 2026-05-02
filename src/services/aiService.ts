import { ChatMessage, FinancialGoal, HouseholdTask, FamilyEvent, ShoppingItem, Transaction } from "../types";
import { 
  financeSkill,
  routineSkill,
  shoppingSkill
} from "../domain/skills";

export const orchestrator = async (
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
  audio?: { data: string; mimeType: string }
) => {
  const activeUserId = targetUserId || userId;
  
  try {
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
        context: {
          tasks: tasks.slice(0, 10),
          finance: transactions.slice(0, 10),
          shopping: shoppingList.slice(0, 10)
        },
        audio
      })
    });

    if (!response.ok) {
      throw new Error("Erro na comunicação com a Aimee Central.");
    }

    const { content, functionCalls } = await response.json();

    let feedback = "";
    if (functionCalls && functionCalls.length > 0) {
      for (const call of functionCalls) {
        const name = call.name;
        const args = call.args;

        if (name === 'addTransaction') {
           await financeSkill.recordTransaction(activeUserId, args);
           feedback += `✅ Registrado: ${args.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${args.amount.toFixed(2)}. `;
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
          await routineSkill.updateTask(activeUserId, args.id, args);
          feedback += `🧹 Tarefa atualizada. `;
        }

        if (name === 'removeFamilyEvent') {
          await routineSkill.removeEvent(activeUserId, args.id);
          feedback += `📅 Evento removido. `;
        }

        if (name === 'updateFamilyEvent') {
          await routineSkill.updateEvent(activeUserId, args.id, args);
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
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    return { ok: data.status === 'healthy' };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
};
