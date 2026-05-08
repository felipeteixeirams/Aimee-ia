import { auth } from './firebase.js';
import { logger } from './logger.js';

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
} as const;
export type OperationType = (typeof OperationType)[keyof typeof OperationType];

export interface FirestoreErrorInfo {
  error: string;
  code?: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function getFriendlyErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || String(error);

  if (message.toLowerCase().includes('offline')) {
    return 'Você parece estar offline. Algumas alterações serão sincronizadas quando você voltar.';
  }

  switch (code) {
    case 'permission-denied':
      return 'Você não tem permissão para realizar esta ação.';
    case 'unauthenticated':
      return 'Sua sessão expirou. Por favor, entre novamente.';
    case 'resource-exhausted':
      return 'Limite de uso atingido. Tente novamente mais tarde.';
    case 'unavailable':
      return 'O serviço está temporariamente indisponível. Verifique sua conexão.';
    case 'not-found':
      return 'O item solicitado não foi encontrado.';
    default:
      if (message.toLowerCase().includes('quota')) return 'Limite de quota excedido para hoje.';
      return 'Ocorreu um erro inesperado. Nossa equipe técnica já foi notificada.';
  }
}

export function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = error?.code;
  const isOffline = errorMessage.toLowerCase().includes('offline');

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    code: errorCode,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  if (isOffline) {
    logger.warn(`Firestore ${operationType.toUpperCase()} - Client Offline (Transient)`, { path });
    // Don't throw for offline errors if you want silent background sync to continue
    return;
  }

  // CRITICAL: The error message MUST be a JSON string as per instructions
  const jsonErrorString = JSON.stringify(errInfo);
  logger.error(`Firestore ${operationType.toUpperCase()} Error`, errInfo, auth.currentUser?.uid);
  
  // Throw the JSON string so the system can parse it
  throw new Error(jsonErrorString);
}
