import { Transaction, ShoppingItem, HouseholdTask } from "../../types/index.js";

export type InsightConfidence = 'confirmed' | 'inferred' | 'weak';

export interface AimeeInsight {
  id: string;
  category: 'finance' | 'shopping' | 'routine';
  title: string;
  message: string;
  confidence: InsightConfidence;
  sources: string[];
  createdAt: string;
}

export class InsightEngine {
  /**
   * Gera insights baseados em evidências reais dos dados.
   */
  static generateInsights(
    transactions: Transaction[],
    shoppingList: ShoppingItem[],
    tasks: HouseholdTask[]
  ): AimeeInsight[] {
    const insights: AimeeInsight[] = [];

    // Exemplo de Insight Financeiro Determinístico
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    if (totalExpense > 0) {
      insights.push({
        id: `fin-${Date.now()}`,
        category: 'finance',
        title: 'Resumo de Gastos',
        message: `Total registrado recentemente: R$ ${totalExpense.toFixed(2)}.`,
        confidence: 'confirmed',
        sources: ['transactions'],
        createdAt: new Date().toISOString()
      });
    }

    // Exemplo de Insight de Compras (Inconsistência)
    const pendingShopping = shoppingList.filter(i => !i.purchased && !i.isStock).length;
    if (pendingShopping > 5) {
      insights.push({
        id: `shop-${Date.now()}`,
        category: 'shopping',
        title: 'Lista Crescendo',
        message: `Sua lista tem ${pendingShopping} itens pendentes. Talvez seja hora de um mercado?`,
        confidence: 'inferred',
        sources: ['shoppingList'],
        createdAt: new Date().toISOString()
      });
    }

    // 3. Previsão de Consumo (Estatística Determinística)
    const milkPurchases = shoppingList
      .filter(i => i.name.toLowerCase().includes('leite') && i.lastPurchasedAt)
      .sort((a, b) => new Date(b.lastPurchasedAt!).getTime() - new Date(a.lastPurchasedAt!).getTime());

    if (milkPurchases.length >= 2) {
      const latest = new Date(milkPurchases[0].lastPurchasedAt!);
      const previous = new Date(milkPurchases[1].lastPurchasedAt!);
      const diffDays = Math.ceil((latest.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      
      const today = new Date();
      const daysSinceLast = Math.ceil((today.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLast >= (diffDays - 1)) {
        insights.push({
          id: `predict-milk-${Date.now()}`,
          category: 'shopping',
          title: 'Previsão de Estoque',
          message: `O leite costuma acabar a cada ${diffDays} dias. O último foi há ${daysSinceLast} dias. Adicionar à lista?`,
          confidence: 'inferred',
          sources: ['shoppingHistory'],
          createdAt: new Date().toISOString()
        });
      }
    }

    // 4. Rotinas e Atrasos
    const overdueTasks = tasks.filter(t => t.status === 'todo' && t.dueDate && new Date(t.dueDate) < new Date());
    if (overdueTasks.length > 0) {
      insights.push({
        id: `task-late-${Date.now()}`,
        category: 'routine',
        title: 'Tarefas Atrasadas',
        message: `Você tem ${overdueTasks.length} tarefas pendentes que já passaram do prazo.`,
        confidence: 'confirmed',
        sources: ['tasks'],
        createdAt: new Date().toISOString()
      });
    }

    return insights;
  }
}
