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

    return insights;
  }
}
