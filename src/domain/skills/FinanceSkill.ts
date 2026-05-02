import { transactionRepository, profileRepository } from '../../infrastructure/repositories';
import { Transaction } from '../../types';
import { logger } from '../../lib/logger';

export class FinanceSkill {
  /**
   * Registra uma transação e realiza ações secundárias (como atualizar metas ou alertar orçamentos)
   */
  async recordTransaction(userId: string, data: Partial<Transaction>): Promise<string> {
    logger.info('FinanceSkill: Recording transaction', { userId, amount: data.amount });

    // 1. Persistir a transação
    const transactionId = await transactionRepository.create({
      amount: data.amount || 0,
      type: data.type || 'expense',
      description: data.description || 'Sem descrição',
      category: data.category || 'Geral',
      date: new Date().toISOString(),
    } as any, userId);

    // 2. Lógica Sequencial: Verificar impacto no orçamento (Placeholder para lógica futura)
    // Ex: if (totalGastosMes > limite) { ... }
    
    return transactionId;
  }

  async getSummary(userId: string) {
    const transactions = await transactionRepository.list([], userId);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      transactionCount: transactions.length
    };
  }
}

export const financeSkill = new FinanceSkill();
