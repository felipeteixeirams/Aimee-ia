import { BaseRepository } from './BaseRepository.js';
import { HouseholdTask } from '../../types/index.js';
import { HouseholdTaskSchema } from '../../models/index.js';

export class TaskRepository extends BaseRepository<HouseholdTask> {
  constructor() {
    super('users/{userId}/tasks', HouseholdTaskSchema);
  }
}

export const taskRepository = new TaskRepository();
