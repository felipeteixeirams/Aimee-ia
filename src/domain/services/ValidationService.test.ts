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
      expect(ValidationService.validateTransaction({ amount: 0 })).toContain('maior que zero');
      expect(ValidationService.validateTransaction({})).toContain('maior que zero');
      expect(ValidationService.validateTransaction({ amount: -10 })).toContain('maior que zero');
    });

    it('should error on missing description', () => {
      expect(ValidationService.validateTransaction({ amount: 10 })).toContain('descrição');
      expect(ValidationService.validateTransaction({ amount: 10, description: ' ' })).toContain('descrição');
    });

    it('should error on invalid type', () => {
      expect(ValidationService.validateTransaction({ 
        amount: 10, 
        description: 'Test', 
        type: 'invalid' as any 
      })).toContain('income');
    });
  });

  describe('validateTask', () => {
    it('should return null for a valid task', () => {
      expect(ValidationService.validateTask({ title: 'Limpar casa' })).toBeNull();
    });

    it('should error on empty title', () => {
      expect(ValidationService.validateTask({})).toContain('não pode estar vazio');
      expect(ValidationService.validateTask({ title: ' ' })).toContain('não pode estar vazio');
    });

    it('should error on title too long', () => {
      const longTitle = 'a'.repeat(201);
      expect(ValidationService.validateTask({ title: longTitle })).toContain('máximo 200');
    });
  });

  describe('validateShoppingItem', () => {
    it('should return null for valid shopping item', () => {
      expect(ValidationService.validateShoppingItem({ name: 'Leite', quantity: 2 })).toBeNull();
    });

    it('should error on empty name', () => {
      expect(ValidationService.validateShoppingItem({})).toContain('obrigatório');
      expect(ValidationService.validateShoppingItem({ name: '' })).toContain('obrigatório');
    });

    it('should error on negative quantity', () => {
      expect(ValidationService.validateShoppingItem({ name: 'Leite', quantity: -1 })).toContain('negativa');
    });
  });
});
