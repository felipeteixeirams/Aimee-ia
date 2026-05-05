import { z } from 'zod';
import { NotificationType } from './index';

// Schema para Notificações (Envio de E-mail)
export const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  email: z.string().email('E-mail inválido'),
  name: z.string().min(2, 'Nome muito curto'),
  days: z.number().optional(),
});

// Schema para Chat/AI Request
export const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'O prompt não pode estar vazio'),
  history: z.array(z.any()).default([]),
  persona: z.string().default('funny'),
  provider: z.enum(['gemini', 'deepseek', 'openai']).optional(),
  context: z.object({
    tasks: z.array(z.any()).optional(),
    events: z.array(z.any()).optional(),
    user: z.any().optional(),
    finance: z.array(z.any()).optional(),
    shopping: z.array(z.any()).optional(),
  }).default({}),
  audio: z.object({
    data: z.string(),
    mimeType: z.string(),
  }).optional(),
});

// Schema para Suporte
export const supportSchema = z.object({
  email: z.string().email('E-mail inválido'),
  message: z.string().min(5, 'A mensagem deve ter pelo menos 5 caracteres').max(100, 'A mensagem deve ter no máximo 100 caracteres'),
});

// Tipos inferidos
export type NotificationInput = z.infer<typeof notificationSchema>;
export type AiRequestInput = z.infer<typeof aiRequestSchema>;
export type SupportInput = z.infer<typeof supportSchema>;
