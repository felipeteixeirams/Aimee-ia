import { FunctionDeclaration, Type } from "@google/genai";

export const addTransactionFn: FunctionDeclaration = {
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

export const addShoppingItemsFn: FunctionDeclaration = {
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
            isStock: { type: Type.BOOLEAN, description: "Se true, adiciona ao estoque doméstico. Se false, adiciona à lista de compras." }
          },
          required: ["name"]
        }
      }
    },
    required: ["items"]
  }
};

export const manageRoutinesFn: FunctionDeclaration = {
  name: "manageRoutines",
  description: "Gerencia tarefas domésticas e eventos da agenda familiar.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      routineType: { type: Type.STRING, enum: ["task", "event"], description: "Se é uma tarefa ou um evento de agenda." },
      action: { type: Type.STRING, enum: ["add", "update", "delete"], description: "Ação a ser realizada." },
      id: { type: Type.STRING, description: "ID do item (apenas para update/delete)." },
      title: { type: Type.STRING, description: "Título." },
      description: { type: Type.STRING, description: "Detalhes." },
      date: { type: Type.STRING, description: "Data (ISO 8601)." },
      categoryOrType: { type: Type.STRING, description: "Categoria da tarefa ou tipo de evento." }
    },
    required: ["routineType", "action", "title"]
  }
};

export const getFinancialInsightsFn: FunctionDeclaration = {
  name: "getFinancialInsights",
  description: "Solicita uma análise profunda dos gastos e sugere economias baseadas no contexto financeiro atual.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      focus: { type: Type.STRING, enum: ["savings", "overspending", "trends"], description: "Foco da análise." }
    }
  }
};

export const allAimeeTools = [
  addTransactionFn,
  addShoppingItemsFn,
  manageRoutinesFn,
  getFinancialInsightsFn
];
