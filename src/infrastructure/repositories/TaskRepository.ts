import { BaseRepository } from './BaseRepository';
import { HouseholdTask } from '../../types';

export class TaskRepository extends BaseRepository<HouseholdTask> {
  constructor() {
    super('users/{userId}/tasks');
  }
}

export const taskRepository = new TaskRepository();
