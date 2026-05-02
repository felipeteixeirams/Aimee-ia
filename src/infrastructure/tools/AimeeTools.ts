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

export const updateShoppingItemsFn: FunctionDeclaration = {
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

export const removeShoppingItemsFn: FunctionDeclaration = {
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

export const addFinancialGoalFn: FunctionDeclaration = {
  name: "addFinancialGoal",
  description: "Cria um novo objetivo financeiro (ex: poupar para viagem, reforma).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Título do objetivo (ex: Viagem para o Japão)" },
      targetAmount: { type: Type.NUMBER, description: "Valor total do objetivo" },
      currentAmount: { type: Type.NUMBER, description: "Valor já poupado", default: 0 },
      category: { type: Type.STRING, enum: ["travel", "renovation", "education", "emergency", "other"], description: "Categoria do objetivo" },
      deadline: { type: Type.STRING, description: "Data limite (ISO 8601)" }
    },
    required: ["title", "targetAmount", "category"]
  }
};

export const updateFinancialGoalFn: FunctionDeclaration = {
  name: "updateFinancialGoal",
  description: "Atualiza o progresso ou detalhes de um objetivo financeiro.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do objetivo" },
      currentAmount: { type: Type.NUMBER, description: "Novo valor total poupado" },
      targetAmount: { type: Type.NUMBER, description: "Novo valor alvo" },
      title: { type: Type.STRING, description: "Novo título" }
    },
    required: ["id"]
  }
};

export const addHouseholdTaskFn: FunctionDeclaration = {
  name: "addHouseholdTask",
  description: "Adiciona uma tarefa doméstica (limpeza, manutenção, recado).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Título da tarefa" },
      description: { type: Type.STRING, description: "Detalhes da tarefa" },
      category: { type: Type.STRING, enum: ["cleaning", "maintenance", "errand", "other"], description: "Categoria" },
      dueDate: { type: Type.STRING, description: "Data limite (ISO 8601)" },
      assignedTo: { type: Type.STRING, description: "Nome da pessoa responsável" }
    },
    required: ["title", "category"]
  }
};

export const updateHouseholdTaskFn: FunctionDeclaration = {
  name: "updateHouseholdTask",
  description: "Atualiza o status ou detalhes de uma tarefa doméstica.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID da tarefa" },
      status: { type: Type.STRING, enum: ["todo", "done"], description: "Novo status" },
      title: { type: Type.STRING },
      assignedTo: { type: Type.STRING }
    },
    required: ["id"]
  }
};

export const addFamilyEventFn: FunctionDeclaration = {
  name: "addFamilyEvent",
  description: "Adiciona um evento à agenda familiar. IMPORTANTE: Antes de adicionar, verifique na lista de eventos se já existe um com o mesmo nome. Se o nome for igual mas a data diferente, sugira atualizar o existente em vez de criar um novo. Se o nome for 80% semelhante, questione o usuário se não é o mesmo evento antes de prosseguir.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Título do evento" },
      description: { type: Type.STRING },
      date: { type: Type.STRING, description: "Data do evento (ISO 8601)" },
      type: { type: Type.STRING, enum: ["social", "holiday", "appointment"], description: "Tipo de evento" }
    },
    required: ["title", "date", "type"]
  }
};

export const removeFamilyEventFn: FunctionDeclaration = {
  name: "removeFamilyEvent",
  description: "Remove um evento da agenda familiar pelo seu ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do evento a ser removido" }
    },
    required: ["id"]
  }
};

export const updateFamilyEventFn: FunctionDeclaration = {
  name: "updateFamilyEvent",
  description: "Atualiza detalhes de um evento existente na agenda (data, título, descrição, tipo).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "ID do evento a ser atualizado" },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      date: { type: Type.STRING, description: "Nova data do evento (ISO 8601)" },
      type: { type: Type.STRING, enum: ["social", "holiday", "appointment"] }
    },
    required: ["id"]
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
  updateShoppingItemsFn,
  removeShoppingItemsFn,
  addFinancialGoalFn,
  updateFinancialGoalFn,
  addHouseholdTaskFn,
  updateHouseholdTaskFn,
  addFamilyEventFn,
  removeFamilyEventFn,
  updateFamilyEventFn,
  getFinancialInsightsFn
];
