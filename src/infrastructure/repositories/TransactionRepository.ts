import { BaseRepository } from './BaseRepository';
import { Transaction } from '../../types';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super('users/{userId}/transactions');
  }
}

export const transactionRepository = new TransactionRepository();
