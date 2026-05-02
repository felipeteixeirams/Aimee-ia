import { Transaction, HouseholdTask, ShoppingItem } from '../../types';

export class ValidationService {
  /**
   * Valida uma transação financeira
   */
  static validateTransaction(data: Partial<Transaction>): string | null {
    if (!data.amount || data.amount <= 0) {
      return "O valor da transação deve ser maior que zero.";
    }
    if (!data.description || data.description.trim().length === 0) {
      return "A descrição da transação é obrigatória.";
    }
    if (!data.type || !['income', 'expense'].includes(data.type)) {
      return "O tipo de transação deve ser 'ganho' (income) ou 'gasto' (expense).";
    }
    return null;
  }

  /**
   * Valida uma tarefa doméstica
   */
  static validateTask(data: Partial<HouseholdTask>): string | null {
    if (!data.title || data.title.trim().length === 0) {
      return "O título da tarefa não pode estar vazio.";
    }
    if (data.title.length > 200) {
      return "O título da tarefa deve ter no máximo 200 caracteres.";
    }
    return null;
  }

  /**
   * Valida um item de compra
   */
  static validateShoppingItem(data: Partial<ShoppingItem>): string | null {
    if (!data.name || data.name.trim().length === 0) {
      return "O nome do item de compra é obrigatório.";
    }
    if (data.quantity !== undefined && data.quantity < 0) {
      return "A quantidade não pode ser negativa.";
    }
    return null;
  }
}
