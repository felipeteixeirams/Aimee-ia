/**
 * @deprecated Este arquivo de schemas de validação do domínio está obsoleto.
 * Toda a validação centralizada de Zod Schemas dinâmica e estática reside agora exclusivamente em `src/models/index.ts`.
 * Não importe deste arquivo. Ele permanece preservado apenas para compatibilidade de histórico de re-exportação.
 */

export {
  FinancialGoalSchema,
  UserProfileSchema,
  TransactionSchema,
  ShoppingItemSchema,
  HouseholdTaskSchema,
  FamilyEventSchema,
  LLMUsageSchema,
  type FinancialGoalInput,
  type UserProfileInput,
  type TransactionInput,
  type ShoppingItemInput,
  type HouseholdTaskInput,
  type FamilyEventInput,
  type LLMUsageInput
} from '../../models/index.js';
