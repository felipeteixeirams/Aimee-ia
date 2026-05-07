import { BaseRepository } from './BaseRepository';
import { Transaction } from '../../types';
import { TransactionSchema } from '../../domain/validation/schemas';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super('users/{userId}/transactions', TransactionSchema);
  }
}

export const transactionRepository = new TransactionRepository();
