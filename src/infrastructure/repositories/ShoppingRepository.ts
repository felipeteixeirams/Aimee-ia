import { BaseRepository } from './BaseRepository';
import { ShoppingItem } from '../../types';

export class ShoppingRepository extends BaseRepository<ShoppingItem> {
  constructor() {
    super('users/{userId}/shoppingList');
  }
}

export const shoppingRepository = new ShoppingRepository();
