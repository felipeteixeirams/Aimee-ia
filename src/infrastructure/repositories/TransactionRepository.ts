import { BaseRepository } from './BaseRepository.js';
import { Transaction } from '../../types/index.js';
import { TransactionSchema } from '../../models/index.js';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super('users/{userId}/transactions', TransactionSchema);
  }
}

export const transactionRepository = new TransactionRepository();
