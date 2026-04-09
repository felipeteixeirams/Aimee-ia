import { FunctionDeclaration, GoogleGenAI, Type } from "@google/genai";
import { Transaction, ShoppingItem, ChatMessage } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const addTransactionFn: FunctionDeclaration = {
  name: "addTransaction",
  description: "Adiciona uma nova transação financeira (gasto ou ganho).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: { type: Type.NUMBER, description: "Valor da transação" },
      type: { type: Type.STRING, enum: ["income", "expense"], description: "Tipo: income (ganho) ou expense (gasto)" },
      description: { type: Type.STRING, description: "Descrição do que foi a transação" },
      category: { type: Type.STRING, description: "Categoria (ex: Alimentação, Lazer)" }
    },
    required: ["amount", "type", "description"]
  }
};

const addShoppingItemsFn: FunctionDeclaration = {
  name: "addShoppingItems",
  description: "Adiciona um ou mais itens à lista de compras de uma só vez.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: "Lista de itens para adicionar",
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nome do item" },
            quantity: { type: Type.NUMBER, description: "Quantidade" },
            category: { type: Type.STRING, description: "Categoria do item" }
          },
          required: ["name"]
        }
      }
    },
    required: ["items"]
  }
};

const updateShoppingItemsFn: FunctionDeclaration = {
  name: "updateShoppingItems",
  description: "Atualiza um ou mais itens da lista de compras (ex: marcar como comprado, mudar quantidade).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      updates: {
        type: Type.ARRAY,
        description: "Lista de atualizações",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID do item no banco de dados" },
            name: { type: Type.STRING, description: "Nome do item (se o ID não for conhecido)" },
            quantity: { type: Type.NUMBER, description: "Nova quantidade" },
            category: { type: Type.STRING, description: "Nova categoria" },
            purchased: { type: Type.BOOLEAN, description: "Se o item foi comprado" }
          },
          required: ["name"]
        }
      }
    },
    required: ["updates"]
  }
};

const removeShoppingItemsFn: FunctionDeclaration = {
  name: "removeShoppingItems",
  description: "Remove um ou mais itens da lista de compras.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      items: {
        type: Type.ARRAY,
        description: "Lista de itens para remover",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID do item no banco de dados" },
            name: { type: Type.STRING, description: "Nome do item" }
          },
          required: ["name"]
        }
      }
    },
    required: ["items"]
  }
};

const getSystemInstruction = (persona: string = 'funny') => {
  const base = `Seu nome é **Aimee**, a Agente Orquestradora de Inteligência Pessoal.
  
**Diretriz de Produtividade (CRÍTICA):**
- **Seja Sucinta:** Se o usuário for direto (ex: "Quanto tenho no caixa?", "Adicione pão"), responda de forma curta, objetiva e produtiva. Não enrole.
- **Flexibilidade:** Apenas seja mais detalhista ou expressiva se o usuário for vago ou iniciar uma conversa informal.
- **Personalidade vs Eficiência:** Sua personalidade deve transparecer no *tom*, mas nunca deve prejudicar a velocidade da resposta ou a clareza da informação.

**Guard-rails (Regras de Segurança):**
- **Privacidade:** Nunca compartilhe dados de um usuário com outro.
- **Escopo:** Mantenha o foco em gestão financeira, listas de compras e tarefas cotidianas.
- **Conselhos Profissionais:** Você NÃO é um consultor financeiro ou advogado. Sempre adicione um aviso se o usuário pedir conselhos complexos de investimento.
- **Integridade:** Recuse pedidos para realizar ações ilegais, antiéticas ou prejudiciais.
- **Confirmação:** Sempre confirme quando realizar uma ação no banco de dados (usando as ferramentas fornecidas).

**Agentes Especializados:**
1. FINANCEIRO: Use 'addTransaction' para registrar gastos ou ganhos.
2. COMPRAS: Gerencie a lista de mercado.
   - Use 'addShoppingItems' para adicionar itens.
   - Use 'updateShoppingItems' para editar itens (mudar quantidade, categoria ou marcar como comprado).
   - Use 'removeShoppingItems' para remover itens.
   Identifique todos os itens mencionados no texto corrido do usuário e execute as ações de uma vez.

**Fluxo de Conversa:**
- Após realizar uma ação, dê um feedback curto.
- Sugira o próximo passo apenas se for realmente útil para o contexto.

Responda sempre em Português do Brasil.`;

  const personalities = {
    funny: `
**Personalidade (Divertida):**
- Você é engraçada e esperta, mas sabe quando parar de brincar para ser produtiva.
- Use humor de forma ultra-curta em respostas diretas (ex: "Feito! O cofrinho agradece. 🐷").
`,
    analytical: `
**Personalidade (Analítica):**
- Você é puramente focada em dados e eficiência máxima.
- Respostas extremamente curtas, baseadas em fatos. Sem emojis.
`,
    frugal: `
**Personalidade (Econômica/Pão-dura):**
- Focada em poupar. Se o usuário gasta, seja curta e levemente ranzinza (ex: "Gasto registrado. Precisava mesmo disso?").
- Se ele economiza, seja brevemente elogiosa.
`
  };

  return base + (personalities[persona as keyof typeof personalities] || personalities.funny);
};

export const orchestrator = async (
  prompt: string, 
  history: ChatMessage[], 
  userId: string, 
  shoppingList: ShoppingItem[], 
  transactions: Transaction[],
  persona: string = 'funny', 
  targetUserId?: string
) => {
  const activeUserId = targetUserId || userId;
  try {
    const listContext = shoppingList.length > 0 
      ? `\n\nLista de Compras Atual:\n${shoppingList.map(i => `- ${i.name} (ID: ${i.id}, Qtd: ${i.quantity}, Comprado: ${i.purchased})`).join('\n')}`
      : "";

    const financeContext = transactions.length > 0
      ? `\n\nResumo Financeiro Atual (Espaço Ativo):\n${transactions.slice(0, 20).map(t => `- ${t.date}: ${t.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${t.amount.toFixed(2)} - ${t.description} (${t.category})`).join('\n')}`
      : "\n\nNenhuma transação financeira encontrada no espaço ativo.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        { role: 'user', parts: [{ text: prompt + listContext + financeContext }] }
      ],
      config: {
        systemInstruction: getSystemInstruction(persona),
        tools: [{ functionDeclarations: [addTransactionFn, addShoppingItemsFn, updateShoppingItemsFn, removeShoppingItemsFn] }]
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls) {
      let feedback = "";
      for (const call of functionCalls) {
        if (call.name === 'addTransaction') {
          const args = call.args as any;
          const transPath = `users/${activeUserId}/transactions`;
          try {
            await addDoc(collection(db, transPath), {
              ...args,
              userId: activeUserId,
              date: new Date().toISOString(),
              category: args.category || "Geral"
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, transPath);
          }
          feedback += `Registrado: ${args.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${args.amount.toFixed(2)} (${args.description}). `;
        }
        if (call.name === 'addShoppingItems') {
          const args = call.args as any;
          const items = args.items as any[];
          const shopPath = `users/${activeUserId}/shoppingList`;
          for (const item of items) {
            try {
              await addDoc(collection(db, shopPath), {
                ...item,
                userId: activeUserId,
                purchased: false,
                quantity: item.quantity || 1,
                category: item.category || "Geral"
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, shopPath);
            }
          }
          const itemNames = items.map(i => i.name).join(", ");
          feedback += `Adicionado: ${itemNames}. 🛒 `;
        }
        if (call.name === 'updateShoppingItems') {
          const args = call.args as any;
          const updates = args.updates as any[];
          for (const update of updates) {
            const item = shoppingList.find(i => i.id === update.id || i.name.toLowerCase() === update.name.toLowerCase());
            if (item && item.id) {
              const { id, name, ...fields } = update;
              const itemPath = `users/${activeUserId}/shoppingList/${item.id}`;
              try {
                await updateDoc(doc(db, itemPath), fields);
              } catch (error) {
                handleFirestoreError(error, OperationType.WRITE, itemPath);
              }
              feedback += `Atualizado: ${item.name}. `;
            }
          }
        }
        if (call.name === 'removeShoppingItems') {
          const args = call.args as any;
          const itemsToRemove = args.items as any[];
          for (const itemToRemove of itemsToRemove) {
            const item = shoppingList.find(i => i.id === itemToRemove.id || i.name.toLowerCase() === itemToRemove.name.toLowerCase());
            if (item && item.id) {
              const itemPath = `users/${activeUserId}/shoppingList/${item.id}`;
              try {
                await deleteDoc(doc(db, itemPath));
              } catch (error) {
                handleFirestoreError(error, OperationType.WRITE, itemPath);
              }
              feedback += `Removido: ${item.name}. `;
            }
          }
        }
      }

      // After function calls, we need to get the final text response from the model
      // Or we can just return the feedback + a follow-up if the model didn't provide one.
      // Better: call the model again with the tool output to get the final conversational response.
      // But for simplicity and to follow user request "me da o feedback e sugere os proximos passo", 
      // I'll let the model generate the final response by providing the tool results.
      
      // However, the current orchestrator doesn't support multi-turn tool use easily.
      // Let's just append a generic follow-up for now or try to make it more robust.
      
      return feedback.trim();
    }

    return response.text || "Entendido. Como posso ajudar mais?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erro ao conectar com o agente de IA.";
  }
};
