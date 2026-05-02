import { shoppingRepository } from '../../infrastructure/repositories';
import { ShoppingItem } from '../../types';
import { logger } from '../../lib/logger';
import { ValidationService } from '../services/ValidationService';

export class ShoppingSkill {
  /**
   * Adiciona itens à lista garantindo que duplicados sejam tratados ou incrementados
   */
  async addItems(userId: string, items: Partial<ShoppingItem>[]): Promise<void> {
    const existingList = await shoppingRepository.list([], userId);

    for (const item of items) {
      // 1. Validação de Negócio
      const error = ValidationService.validateShoppingItem(item);
      if (error) {
        logger.warn('ShoppingSkill: Skipping invalid item', { item, error });
        continue;
      }

      const existing = existingList.find(i => i.name.toLowerCase() === item.name?.toLowerCase());
      
      if (existing && existing.id) {
        await shoppingRepository.update(existing.id, {
          quantity: (existing.quantity || 0) + (item.quantity || 1),
          purchased: false
        }, userId);
      } else {
        await shoppingRepository.create({
          ...item,
          name: item.name || 'Item sem nome',
          quantity: item.quantity || 1,
          purchased: false,
          category: item.category || 'Outros',
          isStock: item.isStock || false
        } as any, userId);
      }
    }
  }

  /**
   * Finaliza uma compra, movendo itens para o estoque
   */
  async finalizeShopping(userId: string): Promise<void> {
    const items = await shoppingRepository.list([], userId);
    const purchased = items.filter(i => i.purchased && !i.isStock);

    await Promise.all(purchased.map(i => i.id && shoppingRepository.update(i.id, {
      isStock: true,
      purchased: false,
      lastPurchasedAt: new Date().toISOString()
    }, userId)));
  }
}

export const shoppingSkill = new ShoppingSkill();
