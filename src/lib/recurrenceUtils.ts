import { addDays, addWeeks, addMonths, addYears, isAfter, format, endOfMonth, setDate, isValid, parseISO } from 'date-fns';
import { RecurrenceType, TaskRecurrence } from '../types/index.js';

export interface GeneratedInstance {
  dueDate: string;
  originalDueDate?: string;
  note?: string;
}

export function generateRecurrenceInstances(
  startDateStr: string,
  recurrence: TaskRecurrence,
  limit: number = 50 // Limit to avoid infinite loops or massive writes
): GeneratedInstance[] {
  const instances: GeneratedInstance[] = [];
  let current = parseISO(startDateStr);
  if (!isValid(current)) current = new Date();

  const endDate = recurrence.endTime ? parseISO(recurrence.endTime) : addYears(current, 1);
  const maxInstances = limit;

  // Include the first one? Usually yes, if it matches.
  // Actually, handleCreateTask will create the first one, or should I generate all?
  // Let's generate all INCLUDING the first one to keep it simple.

  let count = 0;
  while (count < maxInstances && !isAfter(current, endDate)) {
    if (recurrence.type === 'daily') {
      instances.push({ dueDate: current.toISOString() });
      current = addDays(current, recurrence.interval || 1);
    } else if (recurrence.type === 'weekly') {
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        // If specific days are selected, we need to check each day of the week
        // This is a bit more complex, let's simplify for now:
        // For each day in daysOfWeek, starting from current week
        // This logic needs to be robust
        const weekStart = current;
        for (let i = 0; i < 7; i++) {
          const day = addDays(weekStart, i);
          if (recurrence.daysOfWeek.includes(day.getDay()) && !isAfter(day, endDate)) {
            instances.push({ dueDate: day.toISOString() });
          }
        }
        current = addWeeks(current, 1);
      } else {
        instances.push({ dueDate: current.toISOString() });
        current = addWeeks(current, recurrence.interval || 1);
      }
    } else if (recurrence.type === 'monthly') {
      const daysToProcess = (recurrence.daysOfMonth && recurrence.daysOfMonth.length > 0)
        ? recurrence.daysOfMonth
        : [current.getDate()];

      for (const day of daysToProcess) {
        let targetDate = setDate(current, day);
        const lastDay = endOfMonth(current);

        let note: string | undefined;
        let originalDueDate: string | undefined;

        if (day > lastDay.getDate()) {
          originalDueDate = targetDate.toISOString();
          targetDate = lastDay;
          note = `Data ajustada para o último dia do mês (originalmente dia ${day})`;
        }

        if (!isAfter(targetDate, endDate)) {
          instances.push({
            dueDate: targetDate.toISOString(),
            originalDueDate,
            note
          });
        }
      }
      current = addMonths(current, recurrence.interval || 1);
    } else if (recurrence.type === 'annual') {
      instances.push({ dueDate: current.toISOString() });
      current = addYears(current, recurrence.interval || 1);
    }

    count++;
    
    // Safety break if it's not moving forward
    if (recurrence.type === 'weekly' || recurrence.type === 'daily' || recurrence.type === 'monthly' || recurrence.type === 'annual') {
       // already incremented in their blocks
    } else {
       break; 
    }
  }

  // Deduplicate and sort if needed (e.g. weekly with multiple days)
  return instances.filter((v, i, a) => a.findIndex(t => t.dueDate === v.dueDate) === i)
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
