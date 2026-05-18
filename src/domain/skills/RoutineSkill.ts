import { taskRepository, eventRepository } from '../../infrastructure/repositories/index.js';
import { HouseholdTask, TaskRecurrence } from '../../models/index.js';
import { generateRecurrenceInstances } from '../../lib/recurrenceUtils.js';
import { logger } from '../../lib/logger.js';
import { ValidationService } from '../services/ValidationService.js';

export class RoutineSkill {
  /**
   * Cria uma tarefa, lidando com recorrência se necessário
   */
  async addTask(userId: string, task: Partial<HouseholdTask>): Promise<void> {
    logger.info('RoutineSkill: Adding task', { userId, title: task.title });

    // 1. Validação de Negócio
    const error = ValidationService.validateTask(task);
    if (error) throw new Error(error);

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

  async updateTask(userId: string, taskId: string, updates: Partial<HouseholdTask>): Promise<void> {
    logger.info('RoutineSkill: Updating task', { userId, taskId });
    await taskRepository.update(taskId, updates, userId);
  }

  async addEvent(userId: string, event: any): Promise<void> {
    logger.info('RoutineSkill: Adding event', { userId, title: event.title });
    await eventRepository.create(event, userId);
  }

  async removeEvent(userId: string, eventId: string): Promise<void> {
    logger.info('RoutineSkill: Removing event', { userId, eventId });
    await eventRepository.delete(eventId, userId);
  }

  async updateEvent(userId: string, eventId: string, updates: any): Promise<void> {
    logger.info('RoutineSkill: Updating event', { userId, eventId });
    await eventRepository.update(eventId, updates, userId);
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

  async getRoutineHealth(userId: string) {
    const tasks = await taskRepository.list([], userId);
    const completed = tasks.filter(t => t.status === 'done');
    const overdue = tasks.filter(t => t.status === 'todo' && t.dueDate && new Date(t.dueDate) < new Date());

    return {
      completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
      overdueCount: overdue.length,
      totalPending: tasks.filter(t => t.status === 'todo').length
    };
  }
}

export const routineSkill = new RoutineSkill();
