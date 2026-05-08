import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FinanceSkill } from './FinanceSkill.js';
import { transactionRepository } from '../../infrastructure/repositories/index.js';
import { logger } from '../../lib/logger.js';

// Mock dependencies
vi.mock('../../infrastructure/repositories/index.js', () => ({
  transactionRepository: {
    create: vi.fn(),
    list: vi.fn()
  }
}));

vi.mock('../../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('FinanceSkill', () => {
  let financeSkill: FinanceSkill;

  beforeEach(() => {
    financeSkill = new FinanceSkill();
    vi.clearAllMocks();
  });

  describe('recordTransaction', () => {
    it('should successfully record a valid transaction', async () => {
      const mockId = 'trans-123';
      vi.mocked(transactionRepository.create).mockResolvedValue(mockId);

      const data = {
        amount: 50,
        type: 'expense' as const,
        description: 'Almoço'
      };

      const result = await financeSkill.recordTransaction('user-1', data);

      expect(result).toBe(mockId);
      expect(transactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          type: 'expense',
          description: 'Almoço'
        }),
        'user-1'
      );
    });

    it('should throw error if validation fails', async () => {
      const invalidData = { amount: -10, type: 'expense' as const };

      await expect(financeSkill.recordTransaction('user-1', invalidData))
        .rejects.toThrow('amount');
      
      expect(transactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    it('should correctly calculate totals and balance', async () => {
      const mockTransactions: any[] = [
        { amount: 100, type: 'income' },
        { amount: 50, type: 'expense' },
        { amount: 200, type: 'income' },
        { amount: 30, type: 'expense' }
      ];

      vi.mocked(transactionRepository.list).mockResolvedValue(mockTransactions);

      const summary = await financeSkill.getSummary('user-1');

      expect(summary).toEqual({
        balance: 220, // (100+200) - (50+30) = 300 - 80 = 220
        totalIncome: 300,
        totalExpense: 80,
        transactionCount: 4
      });
    });

    it('should correctly calculate totals even with empty list', async () => {
      vi.mocked(transactionRepository.list).mockResolvedValue([]);
      const summary = await financeSkill.getSummary('user-1');
      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpense).toBe(0);
    });

    it('should handle transactions without amount by defaulting to 0', async () => {
      vi.mocked(transactionRepository.list).mockResolvedValue([
        { type: 'income' } as any,
        { type: 'expense' } as any
      ]);
      const summary = await financeSkill.getSummary('user-1');
      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpense).toBe(0);
    });
  });

  describe('recordTransaction defaults', () => {
    it('should use default values if missing in payload', async () => {
      vi.mocked(transactionRepository.create).mockResolvedValue('id');
      await financeSkill.recordTransaction('user-1', { amount: 10, description: 'Desc', type: 'income' });
      
      expect(transactionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10,
          type: 'income',
          category: 'others'
        }),
        'user-1'
      );
    });
  });
});
