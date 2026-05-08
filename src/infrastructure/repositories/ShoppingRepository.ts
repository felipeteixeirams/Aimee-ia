import { BaseRepository } from './BaseRepository.js';
import { ShoppingItem } from '../../types/index.js';
import { ShoppingItemSchema } from '../../domain/validation/schemas.js';

export class ShoppingRepository extends BaseRepository<ShoppingItem> {
  constructor() {
    super('users/{userId}/shoppingList', ShoppingItemSchema);
  }
}

export const shoppingRepository = new ShoppingRepository();
