import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShoppingSkill } from './ShoppingSkill';
import { shoppingRepository } from '../../infrastructure/repositories';
import { logger } from '../../lib/logger';

vi.mock('../../infrastructure/repositories', () => ({
  shoppingRepository: {
    create: vi.fn(),
    update: vi.fn(),
    list: vi.fn()
  }
}));

vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

describe('ShoppingSkill', () => {
  let shoppingSkill: ShoppingSkill;

  beforeEach(() => {
    shoppingSkill = new ShoppingSkill();
    vi.clearAllMocks();
  });

  describe('addItems', () => {
    it('should create new items if not exists', async () => {
      vi.mocked(shoppingRepository.list).mockResolvedValue([]);
      
      const items = [{ name: 'Arroz', quantity: 1 }];
      await shoppingSkill.addItems('user-1', items);

      expect(shoppingRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Arroz', quantity: 1 }),
        'user-1'
      );
    });

    it('should update quantity if item exists with same name (case-insensitive)', async () => {
      vi.mocked(shoppingRepository.list).mockResolvedValue([
        { id: '1', name: 'Arroz', quantity: 2 } as any
      ]);
      
      const items = [{ name: 'arroz', quantity: 1 }];
      await shoppingSkill.addItems('user-1', items);

      expect(shoppingRepository.update).toHaveBeenCalledWith(
        '1',
        { quantity: 3, purchased: false },
        'user-1'
      );
      expect(shoppingRepository.create).not.toHaveBeenCalled();
    });

    it('should skip invalid items', async () => {
      vi.mocked(shoppingRepository.list).mockResolvedValue([]);
      
      const items = [{ name: '', quantity: 1 }]; // Invalid name
      await shoppingSkill.addItems('user-1', items);

      expect(shoppingRepository.create).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  describe('finalizeShopping', () => {
    it('should move purchased items to stock', async () => {
      const mockItems = [
        { id: '1', name: 'A', purchased: true, isStock: false },
        { id: '2', name: 'B', purchased: false, isStock: false },
        { id: '3', name: 'C', purchased: true, isStock: true }
      ] as any[];

      vi.mocked(shoppingRepository.list).mockResolvedValue(mockItems);

      await shoppingSkill.finalizeShopping('user-1');

      expect(shoppingRepository.update).toHaveBeenCalledTimes(1);
      expect(shoppingRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ isStock: true, purchased: false }),
        'user-1'
      );
    });
  });
});
