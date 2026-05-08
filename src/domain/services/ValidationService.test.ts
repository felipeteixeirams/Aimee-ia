import { describe, it, expect } from 'vitest';
import { ValidationService } from './ValidationService';

describe('ValidationService', () => {
  describe('validateTransaction', () => {
    it('should return null for a valid transaction', () => {
      const result = ValidationService.validateTransaction({
        amount: 100,
        description: 'Mercado',
        type: 'expense'
      });
      expect(result).toBeNull();
    });

    it('should error on missing or zero amount', () => {
      expect(ValidationService.validateTransaction({ amount: 0, type: 'expense' })).toContain('maior que zero');
      expect(ValidationService.validateTransaction({ amount: 10, type: 'expense' })).toBeNull();
      expect(ValidationService.validateTransaction({ amount: -10, type: 'expense' })).toContain('negativo');
    });

    it('should error on missing type', () => {
      expect(ValidationService.validateTransaction({ amount: 10 })).toContain('type');
    });

    it('should error on invalid type', () => {
      expect(ValidationService.validateTransaction({ 
        amount: 10, 
        description: 'Test', 
        type: 'invalid' as any 
      })).toContain('type');
    });
  });

  describe('validateTask', () => {
    it('should return null for a valid task', () => {
      expect(ValidationService.validateTask({ 
        title: 'Limpar casa', 
        userId: 'u1', 
        category: 'cleaning', 
        status: 'todo' 
      })).toBeNull();
    });

    it('should error on empty title', () => {
      expect(ValidationService.validateTask({ userId: 'u1', category: 'cleaning', status: 'todo' })).toContain('title');
      expect(ValidationService.validateTask({ title: '', userId: 'u1', category: 'cleaning', status: 'todo' })).toContain('title');
    });

    it('should error on title too long', () => {
      const longTitle = 'a'.repeat(210);
      const result = ValidationService.validateTask({ title: longTitle, userId: 'u1', category: 'cleaning', status: 'todo' });
      expect(result).not.toBeNull();
      expect(result).toContain('title');
    });
  });

  describe('validateShoppingItem', () => {
    it('should return null for valid shopping item', () => {
      expect(ValidationService.validateShoppingItem({ name: 'Leite', quantity: 2 })).toBeNull();
    });

    it('should error on empty name', () => {
      expect(ValidationService.validateShoppingItem({})).toContain('name');
      expect(ValidationService.validateShoppingItem({ name: '' })).toContain('name');
    });

    it('should error on negative quantity', () => {
      expect(ValidationService.validateShoppingItem({ name: 'Leite', quantity: -1 })).toContain('quantity');
    });
  });
});
