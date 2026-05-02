import { taskRepository, eventRepository } from '../../infrastructure/repositories';
import { HouseholdTask, TaskRecurrence } from '../../types';
import { generateRecurrenceInstances } from '../../lib/recurrenceUtils';
import { logger } from '../../lib/logger';

export class RoutineSkill {
  /**
   * Cria uma tarefa, lidando com recorrência se necessário
   */
  async addTask(userId: string, task: Partial<HouseholdTask>): Promise<void> {
    logger.info('RoutineSkill: Adding task', { userId, title: task.title });

    if (task.recurrence) {
      const recurrenceId = crypto.randomUUID();
      const startDate = task.dueDate || new Date().toISOString();
      const instances = generateRecurrenceInstances(startDate, task.recurrence);
      
      await Promise.all(instances.map(inst => taskRepository.create({
        ...task,
        dueDate: inst.dueDate,
        originalDueDate: inst.originalDueDate || null,
        note: inst.note || null,
        recurrenceId,
        status: 'todo'
      } as any, userId)));
    } else {
      await taskRepository.create({
        ...task,
        status: 'todo'
      } as any, userId);
    }
  }

  /**
   * Remove tarefas baseadas no escopo (única, seguintes, todas)
   */
  async deleteTaskWithScope(userId: string, taskId: string, scope: 'single' | 'following' | 'all'): Promise<void> {
    const taskData = await taskRepository.getById(taskId, userId);
    if (!taskData) return;

    if (scope === 'single' || !taskData.recurrenceId) {
      await taskRepository.delete(taskId, userId);
    } else {
      const allTasks = await taskRepository.list([], userId);
      const toDelete = allTasks.filter(t => {
        if (t.recurrenceId !== taskData.recurrenceId) return false;
        if (scope === 'following' && t.dueDate && taskData.dueDate) {
          return new Date(t.dueDate) >= new Date(taskData.dueDate);
        }
        return true;
      });

      await Promise.all(toDelete.map(t => t.id && taskRepository.delete(t.id, userId)));
    }
  }
}

export const routineSkill = new RoutineSkill();
