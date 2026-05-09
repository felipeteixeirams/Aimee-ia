import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely formats a date, returning a fallback string if the date is invalid.
 * Prevents UI crashes from date-fns throwing on invalid dates.
 */
export function safeFormatDate(
  date: Date | string | number | undefined | null, 
  formatStr: string, 
  fallback = 'Data inválida'
): string {
  if (!date) return fallback;
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return fallback;
    return format(d, formatStr, { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error, { date, formatStr });
    return fallback;
  }
}
