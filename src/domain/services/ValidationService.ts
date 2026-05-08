import { Transaction, HouseholdTask, ShoppingItem } from '../../types/index.js';
import { TransactionSchema, HouseholdTaskSchema, ShoppingItemSchema } from '../validation/schemas.js';
import { z } from 'zod';

export class ValidationService {
  /**
   * Valida uma transação financeira
   */
  static validateTransaction(data: any): string | null {
    try {
      TransactionSchema.parse(data);
      if (data.amount <= 0) return "O valor da transação deve ser maior que zero.";
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join('.')}: ${issue.message}`;
      }
      return "Dados da transação inválidos";
    }
  }

  /**
   * Valida uma tarefa doméstica
   */
  static validateTask(data: any): string | null {
    try {
      HouseholdTaskSchema.parse(data);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join('.')}: ${issue.message}`;
      }
      return "Dados da tarefa inválidos";
    }
  }

  /**
   * Valida um item de compra
   */
  static validateShoppingItem(data: any): string | null {
    try {
      ShoppingItemSchema.parse(data);
      if (data.quantity < 0) return "A quantidade não pode ser negativa.";
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issue = error.issues[0];
        return `Erro no campo ${issue.path.join('.')}: ${issue.message}`;
      }
      return "Dados do item inválidos";
    }
  }
}
