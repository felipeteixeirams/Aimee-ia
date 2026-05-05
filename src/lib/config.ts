import { logger } from './logger';
import localFirebaseConfig from '../../firebase-applet-config.json';

/**
 * Interface representing all application configurations.
 */
export interface AppConfig {
  env: string;
  isProduction: boolean;
  isDevelopment: boolean;
  
  // AI Config
  geminiApiKey: string;
  deepseekApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  
  // Firebase Config (Frontend)
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
    databaseId?: string;
  };

  // Firebase Admin Config (Server-side)
  firebaseAdmin: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  
  // Infrastructure
  appUrl: string;
  port: number;
  
  // Email Config (Server-side)
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    adminEmail: string;
  };
  
  // Google OAuth
  google: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    mapsApiKey?: string;
  };
}

const isServer = typeof window === 'undefined';

/**
 * Accesses environment variables safely depending on the runtime (Vite vs Node).
 */
function getEnv(key: string, defaultValue = ''): string {
  if (isServer) {
    return process.env[key] || defaultValue;
  }
  // Try import.meta.env first (standard Vite), then fallback to process.env (Vite-injected define)
  return (import.meta as any).env[key] || (window as any).process?.env?.[key] || defaultValue;
}

/**
 * Accesses Vite environment variables specifically.
 */
function getViteEnv(key: string, defaultValue = ''): string {
  // Vite prefixes client-side variables with VITE_
  const viteKey = key.startsWith('VITE_') ? key : `VITE_${key}`;
  if (isServer) {
    return process.env[viteKey] || process.env[key] || defaultValue;
  }
  return (import.meta as any).env[viteKey] || defaultValue;
}

export const config: AppConfig = {
  env: getEnv('NODE_ENV', 'development'),
  isProduction: getEnv('NODE_ENV') === 'production',
  isDevelopment: getEnv('NODE_ENV') !== 'production',
  
  geminiApiKey: getEnv('GEMINI_API_KEY'),
  deepseekApiKey: getEnv('DEEPSEEK_API_KEY'),
  openaiApiKey: getEnv('OPENAI_API_KEY'),
  anthropicApiKey: getEnv('ANTHROPIC_API_KEY'),
  
  firebase: {
    apiKey: getViteEnv('FIREBASE_API_KEY') || localFirebaseConfig.apiKey || '',
    authDomain: getViteEnv('FIREBASE_AUTH_DOMAIN') || localFirebaseConfig.authDomain || '',
    projectId: getViteEnv('FIREBASE_PROJECT_ID') || localFirebaseConfig.projectId || '',
    storageBucket: getViteEnv('FIREBASE_STORAGE_BUCKET') || localFirebaseConfig.storageBucket || '',
    messagingSenderId: getViteEnv('FIREBASE_MESSAGING_SENDER_ID') || localFirebaseConfig.messagingSenderId || '',
    appId: getViteEnv('FIREBASE_APP_ID') || localFirebaseConfig.appId || '',
    measurementId: getViteEnv('FIREBASE_MEASUREMENT_ID') || localFirebaseConfig.measurementId || '',
    databaseId: getViteEnv('FIREBASE_DATABASE_ID') || localFirebaseConfig.firestoreDatabaseId || '',
  },
  
  firebaseAdmin: {
    projectId: getEnv('FIREBASE_PROJECT_ID') || localFirebaseConfig.projectId || '',
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL') || '',
    privateKey: getEnv('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n') || '',
  },
  
  appUrl: getEnv('APP_URL', 'http://localhost:3000'),
  port: parseInt(getEnv('PORT', '3000'), 10),
  
  email: {
    host: getEnv('SMTP_HOST', 'smtp.gmail.com'),
    port: parseInt(getEnv('SMTP_PORT', '587'), 10),
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
    adminEmail: getEnv('ADMIN_EMAIL'),
  },
  
  google: {
    clientId: getEnv('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: getEnv('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectUri: getEnv('GOOGLE_OAUTH_REDIRECT_URI'),
    mapsApiKey: getViteEnv('GOOGLE_MAPS_API_KEY'),
  }
};

/**
 * Validates that all required configuration variables are present.
 * Throws an error or logs warnings if critical variables are missing.
 */
export function validateConfig(): boolean {
  const missingCritical: string[] = [];
  const missingRecommended: string[] = [];
  
  // Critical for AI (Server-side check)
  const hasAnyAiKey = config.geminiApiKey || config.deepseekApiKey || config.openaiApiKey || config.anthropicApiKey;
  if (!hasAnyAiKey && isServer) {
    missingCritical.push('GEMINI_API_KEY ou OPENAI_API_KEY ou DEEPSEEK_API_KEY');
  }
  
  // Critical for Firebase (Always required)
  if (!config.firebase.apiKey) missingCritical.push('FIREBASE_API_KEY');
  if (!config.firebase.projectId) missingCritical.push('FIREBASE_PROJECT_ID');
  
  // Critical for Email (Server-only)
  if (isServer) {
    if (!config.email.user) missingCritical.push('SMTP_USER');
    if (!config.email.pass) missingCritical.push('SMTP_PASS');
    if (!config.email.adminEmail) missingCritical.push('ADMIN_EMAIL');
  }
  
  if (missingCritical.length > 0) {
    const errorDetail = {
      timestamp: new Date().toISOString(),
      missing: missingCritical,
      context: isServer ? 'BACKEND' : 'FRONTEND',
      remediation: isServer 
        ? 'Verifique o arquivo .env ou as variáveis de ambiente do seu provedor de nuvem.' 
        : 'Verifique se as variáveis VITE_* estão corretamente definidas e expostas.'
    };
    
    logger.error('⚠️ FALHA CRÍTICA DE CONFIGURAÇÃO ⚠️', errorDetail);
    
    // In production, we must fail fast to avoid unpredictable behavior
    if (config.isProduction || isServer) {
      console.error('\n\n' + '='.repeat(50));
      console.error('ERRO DE INICIALIZAÇÃO: VARIÁVEIS AUSENTES');
      console.error(JSON.stringify(errorDetail, null, 2));
      console.error('='.repeat(50) + '\n\n');
      
      if (isServer) {
        // We don't exit(1) here because it's a dev server in AI Studio often, 
        // but we make sure it's visible.
      }
    }
    return false;
  }
  
  if (missingRecommended.length > 0) {
    logger.warn('Recommended configuration missing', { missingVars: missingRecommended, isServer });
  }
  
  logger.info('Configuration validated successfully', { env: config.env, isServer });
  return true;
}
