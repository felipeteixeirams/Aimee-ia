import { BaseRepository } from './BaseRepository';
import { HouseholdTask } from '../../types';
import { HouseholdTaskSchema } from '../../domain/validation/schemas';

export class TaskRepository extends BaseRepository<HouseholdTask> {
  constructor() {
    super('users/{userId}/tasks', HouseholdTaskSchema);
  }
}

export const taskRepository = new TaskRepository();
