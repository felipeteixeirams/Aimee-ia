import { Transaction, HouseholdTask, ShoppingItem } from '../../types';
import { TransactionSchema, HouseholdTaskSchema, ShoppingItemSchema } from '../validation/schemas';
import { z } from 'zod';

export class ValidationService {
  /**
   * Valida uma transação financeira
   */
  static validateTransaction(data: Partial<Transaction>): string | null {
    try {
      // For skill validation, treat as partial to avoid issues with missing fields during AI processing
      TransactionSchema.partial().parse(data);
      if (data.amount !== undefined && data.amount <= 0) return "O valor da transação deve ser maior que zero.";
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0].message;
      }
      return "Dados da transação inválidos";
    }
  }

  /**
   * Valida uma tarefa doméstica
   */
  static validateTask(data: Partial<HouseholdTask>): string | null {
    try {
      HouseholdTaskSchema.partial().parse(data);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0].message;
      }
      return "Dados da tarefa inválidos";
    }
  }

  /**
   * Valida um item de compra
   */
  static validateShoppingItem(data: Partial<ShoppingItem>): string | null {
    try {
      ShoppingItemSchema.partial().parse(data);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0].message;
      }
      return "Dados do item inválidos";
    }
  }
}
