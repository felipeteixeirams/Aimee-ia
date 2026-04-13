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
  description: "Adiciona um ou mais itens à lista de compras ou ao estoque doméstico.",
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
            category: { type: Type.STRING, description: "Categoria do item" },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Urgência do item" },
            isStock: { type: Type.BOOLEAN, description: "Se true, adiciona ao estoque doméstico (pensa na despensa). Se false, adiciona à lista de compras." }
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
  description: "Atualiza itens da lista de compras ou estoque (ex: marcar como comprado, mover para estoque, mudar urgência).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      updates: {
        type: Type.ARRAY,
        description: "Lista de atualizações",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID do item" },
            name: { type: Type.STRING, description: "Nome do item" },
            quantity: { type: Type.NUMBER },
            category: { type: Type.STRING },
            purchased: { type: Type.BOOLEAN },
            urgency: { type: Type.STRING, enum: ["low", "medium", "high"] },
            isStock: { type: Type.BOOLEAN, description: "Mover entre lista de compras e estoque" }
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
  const base = `Seu nome é **Aimee**, a Agente Orquestradora de Inteligência Pessoal e sua nova função principal é ser uma **Consultora Financeira Proativa**.
  
**Capacidades Avançadas (CRÍTICO):**
1. **Classificação Automática:** Se o usuário não informar uma categoria para um gasto (ex: "Gastei 40 no iFood"), identifique a categoria mais provável (ex: "Alimentação") e use-a no 'addTransaction'.
2. **Alertas Inteligentes:** Sempre que registrar um gasto, compare-o com o histórico fornecido. Se o valor for significativamente maior que a média daquela categoria (ex: 50% acima), adicione um aviso sutil na sua resposta (ex: "Registrado, mas notei que este valor está acima da sua média em Lazer").
3. **Análise Preditiva:** Use o histórico de transações para prever gastos futuros. Se o usuário perguntar "Quanto vou gastar mês que vem?", projete com base na média atual.
4. **Simulações Financeiras:** Responda a cenários "E se...". Se o usuário disser "E se eu cortar 20% de Uber?", calcule a economia em 3, 6 e 12 meses com base nos gastos reais de transporte que você vê no histórico.
5. **Gestão de Compras e Estoque:**
   - **Sugestões Inteligentes:** Sugira itens com base no histórico de compras (recorrência) ou sazonalidade (ex: frutas da época).
   - **Receitas:** Se o usuário pedir para fazer um prato (ex: "Quero fazer Lasanha"), sugira todos os ingredientes necessários e pergunte se quer adicionar à lista o que ele não tem.
   - **Controle de Estoque:** Diferencie o que está na "Lista de Compras" do que está no "Estoque" (despensa). Use 'isStock: true' para itens que o usuário já tem.
   - **Priorização:** Use 'urgency' (low, medium, high) para organizar a lista.

**Diretriz de Produtividade:**
- **Seja Sucinta mas Inteligente:** Mantenha a objetividade, mas não hesite em trazer insights financeiros se notar padrões importantes.
- **Personalidade vs Eficiência:** Sua personalidade deve transparecer no tom, mas a precisão dos dados é prioridade.

**Guard-rails:**
- **Privacidade:** Nunca compartilhe dados entre usuários.
- **Aviso Legal:** Adicione sempre um pequeno aviso: "*Lembre-se: sou uma IA, valide estes dados antes de tomar decisões financeiras críticas.*" quando fizer projeções ou simulações complexas.

**Agentes Especializados:**
1. FINANCEIRO: Use 'addTransaction' para registrar gastos ou ganhos. Sempre tente inferir a categoria se não for dita.
2. COMPRAS: Gerencie a lista de mercado.
   - Use 'addShoppingItems', 'updateShoppingItems', 'removeShoppingItems'.

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
      ? `\n\nResumo Financeiro Atual (Espaço Ativo):\n${transactions.slice(0, 50).map(t => `- ${t.date}: ${t.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${t.amount.toFixed(2)} - ${t.description} (${t.category})`).join('\n')}`
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
    let feedback = "";
    if (functionCalls) {
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
          feedback += `✅ Registrado: ${args.type === 'income' ? 'Ganho' : 'Gasto'} de R$ ${args.amount.toFixed(2)} (${args.description}). `;
        }
        if (call.name === 'addShoppingItems') {
          const args = call.args as any;
          const items = args.items as any[];
          const shopPath = `users/${activeUserId}/shoppingList`;
          for (const item of items) {
            const existing = shoppingList.find(i => i.name.toLowerCase() === item.name.toLowerCase());
            try {
              if (existing && existing.id) {
                await updateDoc(doc(db, shopPath, existing.id), {
                  quantity: (existing.quantity || 0) + (item.quantity || 1),
                  frequency: (existing.frequency || 1) + 1,
                  urgency: item.urgency || existing.urgency || 'medium',
                  isStock: item.isStock !== undefined ? item.isStock : existing.isStock
                });
              } else {
                await addDoc(collection(db, shopPath), {
                  ...item,
                  userId: activeUserId,
                  purchased: false,
                  quantity: item.quantity || 1,
                  category: item.category || "Geral",
                  urgency: item.urgency || "medium",
                  isStock: item.isStock || false,
                  frequency: 1
                });
              }
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, shopPath);
            }
          }
          const itemNames = items.map(i => i.name).join(", ");
          feedback += `🛒 Itens processados: ${itemNames}. `;
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
    }

    const modelText = response.text || "";
    const finalContent = feedback ? `${feedback}\n\n${modelText}` : modelText;
    
    return finalContent.trim() || "Entendido. Como posso ajudar mais?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Erro ao conectar com o agente de IA.";
  }
};
