/**
 * @deprecated Este arquivo de schemas de types está obsoleto.
 * Toda a validação centralizada de Zod Schemas e inferência de tipos correspondentes residem exclusivamente em `src/models/index.ts`.
 * Não importe deste arquivo. Ele permanece preservado apenas para compatibilidade de histórico de re-exportação.
 */

export {
  notificationSchema,
  aiRequestSchema,
  supportSchema,
  type NotificationInput,
  type AiRequestInput,
  type SupportInput
} from '../models/index.js';
