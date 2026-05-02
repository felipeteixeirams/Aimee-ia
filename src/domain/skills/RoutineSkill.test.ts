import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoutineSkill } from './RoutineSkill';
import { taskRepository } from '../../infrastructure/repositories';
import { generateRecurrenceInstances } from '../../lib/recurrenceUtils';

vi.mock('../../infrastructure/repositories', () => ({
  taskRepository: {
    create: vi.fn(),
    update: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    delete: vi.fn()
  },
  eventRepository: {
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }
}));

vi.mock('../../lib/recurrenceUtils', () => ({
  generateRecurrenceInstances: vi.fn()
}));

vi.mock('../../lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('RoutineSkill', () => {
  let routineSkill: RoutineSkill;

  beforeEach(() => {
    routineSkill = new RoutineSkill();
    vi.clearAllMocks();
  });

  describe('addTask', () => {
    it('should create a single task without recurrence', async () => {
      const task = { title: 'Lavar louça' };
      await routineSkill.addTask('user-1', task);

      expect(taskRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Lavar louça', status: 'todo' }),
        'user-1'
      );
    });

    it('should create multiple tasks with recurrence', async () => {
      const task = { title: 'Medicamento', recurrence: 'daily' as any };
      vi.mocked(generateRecurrenceInstances).mockReturnValue([
          { dueDate: '2024-01-01', originalDueDate: '2024-01-01' },
          { dueDate: '2024-01-02', originalDueDate: '2024-01-02' }
      ]);

      await routineSkill.addTask('user-1', task);

      expect(taskRepository.create).toHaveBeenCalledTimes(2);
      expect(generateRecurrenceInstances).toHaveBeenCalled();
    });
  });

  describe('deleteTaskWithScope', () => {
    it('should delete a single task', async () => {
      vi.mocked(taskRepository.getById).mockResolvedValue({ id: '1', title: 'Test' } as any);
      
      await routineSkill.deleteTaskWithScope('user-1', '1', 'single');

      expect(taskRepository.delete).toHaveBeenCalledWith('1', 'user-1');
    });

    it('should delete all tasks in recurrence', async () => {
      vi.mocked(taskRepository.getById).mockResolvedValue({ 
        id: '1', 
        recurrenceId: 'group-1' 
      } as any);
      
      vi.mocked(taskRepository.list).mockResolvedValue([
        { id: '1', recurrenceId: 'group-1' },
        { id: '2', recurrenceId: 'group-1' },
        { id: '3', recurrenceId: 'group-2' }
      ] as any);

      await routineSkill.deleteTaskWithScope('user-1', '1', 'all');

      expect(taskRepository.delete).toHaveBeenCalledTimes(2);
      expect(taskRepository.delete).toHaveBeenCalledWith('1', 'user-1');
      expect(taskRepository.delete).toHaveBeenCalledWith('2', 'user-1');
    });

    it('should delete following tasks in recurrence', async () => {
      vi.mocked(taskRepository.getById).mockResolvedValue({ 
        id: '1', 
        recurrenceId: 'group-1',
        dueDate: '2024-01-05'
      } as any);
      
      vi.mocked(taskRepository.list).mockResolvedValue([
        { id: '1', recurrenceId: 'group-1', dueDate: '2024-01-05' },
        { id: '2', recurrenceId: 'group-1', dueDate: '2024-01-06' },
        { id: '3', recurrenceId: 'group-1', dueDate: '2024-01-04' }
      ] as any);

      await routineSkill.deleteTaskWithScope('user-1', '1', 'following');

      expect(taskRepository.delete).toHaveBeenCalledTimes(2);
      expect(taskRepository.delete).toHaveBeenCalledWith('1', 'user-1');
      expect(taskRepository.delete).toHaveBeenCalledWith('2', 'user-1');
      expect(taskRepository.delete).not.toHaveBeenCalledWith('3', 'user-1');
    });

    it('should do nothing if task not found', async () => {
      vi.mocked(taskRepository.getById).mockResolvedValue(null);
      await routineSkill.deleteTaskWithScope('user-1', '999', 'single');
      expect(taskRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should update task', async () => {
      await routineSkill.updateTask('user-1', 't1', { status: 'done' });
      expect(vi.mocked(taskRepository).update).toHaveBeenCalledWith('t1', { status: 'done' }, 'user-1');
    });

    it('should add/update/remove events', async () => {
        const { eventRepository } = await import('../../infrastructure/repositories');
        await routineSkill.addEvent('user-1', { title: 'E1' });
        expect(eventRepository.create).toHaveBeenCalled();

        await routineSkill.updateEvent('user-1', 'e1', { title: 'E2' });
        expect(eventRepository.update).toHaveBeenCalled();

        await routineSkill.removeEvent('user-1', 'e1');
        expect(eventRepository.delete).toHaveBeenCalled();
    });
  });
});
