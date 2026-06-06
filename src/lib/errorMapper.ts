import { logger } from './logger.js';

export interface MappedError {
  friendlyMessage: string;
  code: string;
  rawMessage: string;
  operation: string;
  path?: string;
  remediation?: string;
}

/**
 * Maps any Firestore, Firebase or typical infrastructure error to a clean, human-friendly representation
 * and provides clear diagnostic tips based on error codes and messages.
 */
export function mapInfrastructureError(error: any, operation: string, path?: string): MappedError {
  const rawMsg = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code ?? '';
  const errorStatus = (error as any)?.status ?? '';
  
  let friendlyMessage = 'Ocorreu um erro inesperado ao acessar o serviço.';
  let code = 'UNKNOWN_ERROR';
  let remediation = 'Verifique os logs detalhados do servidor ou a conectividade.';

  const combinedString = `${rawMsg} ${errorCode} ${errorStatus}`.toLowerCase();

  // 1. Permission Denied (gRPC 7 or Firestore Client Error)
  if (
    combinedString.includes('permission_denied') || 
    combinedString.includes('permission-denied') ||
    combinedString.includes('permission denied') ||
    combinedString.includes('insufficient permissions') ||
    combinedString.includes('insufficient privilege') ||
    errorCode === 7 ||
    errorCode === 'permission-denied'
  ) {
    code = 'PERMISSION_DENIED';
    friendlyMessage = 'Permissão negada ou privilégios insuficientes para realizar esta operação.';
    remediation = 'Verifique se as Regras de Segurança do Firestore permitem essa ação, se o usuário possui login ativo, ou se as credenciais do Service Account têm permissão de Administrador do Firestore (especialmente se houver múltiplos aplicativos configurados).';
  }
  // 2. Deadline Exceeded (gRPC 4 or Firestore/network timeouts)
  else if (
    combinedString.includes('deadline_exceeded') ||
    combinedString.includes('deadline-exceeded') ||
    combinedString.includes('timeout') ||
    errorCode === 4 ||
    errorCode === 'deadline-exceeded'
  ) {
    code = 'DEADLINE_EXCEEDED';
    friendlyMessage = 'Tempo limite de operação excedido (Deadline Exceeded). O banco de dados demorou para responder.';
    remediation = 'Pode ser instabilidade na rede ou resolução de nomes de servidor. Verifique as configurações de rede ou se o banco de dados está localizado na mesma região geográfica.';
  }
  // 3. Unauthenticated (gRPC 16)
  else if (
    combinedString.includes('unauthenticated') ||
    errorCode === 16 ||
    errorCode === 'unauthenticated'
  ) {
    code = 'UNAUTHENTICATED';
    friendlyMessage = 'Sessão inválida ou credenciais ausentes.';
    remediation = 'Certifique-se de que o usuário está adequadamente autenticado antes de realizar operações de gravação/leitura.';
  }
  // 4. Resource Exhausted / Quota Exceeded (gRPC 8)
  else if (
    combinedString.includes('resource_exhausted') ||
    combinedString.includes('quota exceeded') ||
    errorCode === 8 ||
    errorCode === 'resource-exhausted'
  ) {
    code = 'RESOURCE_EXHAUSTED';
    friendlyMessage = 'Cota ou limite de recursos do banco de dados excedido.';
    remediation = 'O plano de uso pode ter atingido a cota diária do Firestore ou o limite de requisições por segundo. Revise o dashboard do console Firebase.';
  }
  // 5. Connection / Host unreachable (name resolution failures)
  else if (
    combinedString.includes('name resolution') ||
    combinedString.includes('host') ||
    combinedString.includes('cannot resolve') ||
    combinedString.includes('getaddrinfo')
  ) {
    code = 'NETWORK_RESOLUTION_ERROR';
    friendlyMessage = 'Erro de rede: Não foi possível resolver o endereço do servidor.';
    remediation = 'Falha temporária de DNS ou conectividade à internet no servidor de hospedagem (Vercel/Cloud Run).';
  }
  // 6. Project/App Not Found
  else if (
    combinedString.includes('project') && combinedString.includes('not found')
  ) {
    code = 'PROJECT_NOT_FOUND';
    friendlyMessage = 'O projeto ou a base de dados configurada no Firebase não foi encontrado.';
    remediation = 'Verifique se o Project ID do Firebase configurado é o correto e correspondente ao projeto provisionado.';
  }

  return {
    friendlyMessage,
    code,
    rawMessage: rawMsg,
    operation,
    path,
    remediation
  };
}

/**
 * Logs a mapped error cleanly without flooding the logs with large recursive Stack Traces in production.
 */
export function logMappedError(error: any, operation: string, context?: Record<string, any>) {
  const mapped = mapInfrastructureError(error, operation, context?.path);
  
  // Decide if we should include stack. In production, we log a neat summary.
  // In development, we can attach the stack to debug/verbose logs to help programmers.
  const isDev = process.env.NODE_ENV !== 'production' || (import.meta as any).env?.DEV;
  
  const logDetails: Record<string, any> = {
    code: mapped.code,
    rawMessage: mapped.rawMessage,
    friendlyMessage: mapped.friendlyMessage,
    remediation: mapped.remediation,
    operation: mapped.operation,
    path: mapped.path,
    ...context
  };

  if (isDev && error instanceof Error) {
    logDetails.stack = error.stack;
  }

  logger.error(`[Infrastructure Error] Map: ${mapped.code} | Msg: ${mapped.friendlyMessage}`, logDetails);
  
  return mapped;
}
