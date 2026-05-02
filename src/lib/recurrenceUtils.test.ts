import { describe, it, expect } from 'vitest';
import { generateRecurrenceInstances } from './recurrenceUtils';

describe('recurrenceUtils', () => {
  describe('generateRecurrenceInstances', () => {
    it('should generate daily instances', () => {
      const startDate = '2024-01-01T10:00:00Z';
      const recurrence = { type: 'daily' as any, interval: 2 };
      const limit = 3;
      
      const result = generateRecurrenceInstances(startDate, recurrence, limit);
      
      expect(result).toHaveLength(3);
      expect(result[0].dueDate).toBe('2024-01-01T10:00:00.000Z');
      expect(result[1].dueDate).toBe('2024-01-03T10:00:00.000Z');
      expect(result[2].dueDate).toBe('2024-01-05T10:00:00.000Z');
    });

    it('should generate weekly instances with specific days', () => {
      const startDate = '2024-01-01T10:00:00Z'; // Monday
      const recurrence = { 
        type: 'weekly' as any, 
        daysOfWeek: [1, 3] // Mon, Wed
      };
      
      const result = generateRecurrenceInstances(startDate, recurrence, 2);
      
      expect(result).toHaveLength(4); // 2 weeks * 2 days = 4
      expect(result[0].dueDate).toContain('2024-01-01');
      expect(result[1].dueDate).toContain('2024-01-03');
      expect(result[2].dueDate).toContain('2024-01-08');
      expect(result[3].dueDate).toContain('2024-01-10');
    });

    it('should generate monthly instances and handle month-end adjustment', () => {
      const startDate = '2024-01-31T10:00:00Z'; 
      const recurrence = { 
        type: 'monthly' as any,
        daysOfMonth: [31]
      };
      
      const result = generateRecurrenceInstances(startDate, recurrence, 2);
      
      expect(result).toHaveLength(2);
      expect(result[0].dueDate).toContain('2024-01-31');
      expect(result[1].dueDate).toContain('2024-02-29'); // Leap year adjustment
      expect(result[1].note).toContain('Data ajustada');
    });

    it('should respect endTime', () => {
      const startDate = '2024-01-01T10:00:00Z';
      const recurrence = { 
        type: 'daily' as any, 
        endTime: '2024-01-03T00:00:00Z' 
      };
      
      const result = generateRecurrenceInstances(startDate, recurrence);
      
      expect(result).toHaveLength(2); // Jan 1, Jan 2
      expect(new Date(result[1].dueDate).getDate()).toBe(2);
    });

    it('should generate annual instances', () => {
        const startDate = '2024-01-01T10:00:00Z';
        const recurrence = { type: 'annual' as any, interval: 1 };
        const result = generateRecurrenceInstances(startDate, recurrence, 2);
        
        expect(result).toHaveLength(2);
        expect(result[0].dueDate).toContain('2024-01-01');
        expect(result[1].dueDate).toContain('2025-01-01');
    });

    it('should fallback to current date if startDate is invalid', () => {
        const result = generateRecurrenceInstances('invalid', { type: 'daily' as any }, 1);
        expect(result).toHaveLength(1);
        expect(new Date(result[0].dueDate)).toBeInstanceOf(Date);
    });

    it('should handle weekly without daysOfWeek', () => {
        const startDate = '2024-01-01T10:00:00Z';
        const recurrence = { type: 'weekly' as any, interval: 1 };
        const result = generateRecurrenceInstances(startDate, recurrence, 2);
        expect(result).toHaveLength(2);
        expect(result[1].dueDate).toContain('2024-01-08');
    });
  });
});
