import { BaseRepository } from './BaseRepository.js';
import { ShoppingItem, ShoppingItemSchema } from '../../models/index.js';

export class ShoppingRepository extends BaseRepository<ShoppingItem> {
  constructor() {
    super('users/{userId}/shoppingList', ShoppingItemSchema);
  }
}

export const shoppingRepository = new ShoppingRepository();
