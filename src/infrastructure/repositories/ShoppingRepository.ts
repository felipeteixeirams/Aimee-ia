import { BaseRepository } from './BaseRepository';
import { ShoppingItem } from '../../types';
import { ShoppingItemSchema } from '../../domain/validation/schemas';

export class ShoppingRepository extends BaseRepository<ShoppingItem> {
  constructor() {
    super('users/{userId}/shoppingList', ShoppingItemSchema);
  }
}

export const shoppingRepository = new ShoppingRepository();
