import admin from 'firebase-admin';
import { config as appConfig } from '../lib/config.js';

let firebaseAdminInstance: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (firebaseAdminInstance) return firebaseAdminInstance;

  try {
    const projectId = appConfig.firebaseAdmin.projectId;
    const clientEmail = appConfig.firebaseAdmin.clientEmail;
    let privateKey = appConfig.firebaseAdmin.privateKey;

    if (privateKey) {
      privateKey = privateKey.trim();
      // Remove enclosing quotes if any survived config parsing
      if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
        privateKey = privateKey.slice(1, -1).trim();
      }
      // Guarantee standard newlines
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
    }

    if (admin.apps.length > 0) {
      console.log(`[FirebaseAdmin] Default app already exists. Reusing existing instance.`);
      firebaseAdminInstance = admin.app();
      return firebaseAdminInstance;
    }

    console.log(`[FirebaseAdmin Diagnostic] Initializing Firebase Admin SDK...`);
    console.log(`[FirebaseAdmin Diagnostic] Configured Project ID: "${projectId}"`);
    console.log(`[FirebaseAdmin Diagnostic] Configured Client Email: "${clientEmail}"`);
    
    if (privateKey) {
      const hasBeginHeader = privateKey.includes("-----BEGIN PRIVATE KEY-----");
      const hasEndHeader = privateKey.includes("-----END PRIVATE KEY-----");
      const containsLiteralSlashN = privateKey.includes("\\n");
      const containsRealNewline = privateKey.includes("\n");
      
      console.log(`[FirebaseAdmin Diagnostic] Private Key exists. Length: ${privateKey.length} chars.`);
      console.log(`[FirebaseAdmin Diagnostic] Contains -----BEGIN PRIVATE KEY-----: ${hasBeginHeader}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains -----END PRIVATE KEY-----: ${hasEndHeader}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains raw/literal '\\n': ${containsLiteralSlashN}`);
      console.log(`[FirebaseAdmin Diagnostic] Contains actual newline character: ${containsRealNewline}`);
      
      if (!hasBeginHeader || !hasEndHeader) {
        console.warn(`[FirebaseAdmin Diagnostic] WARNING: Private key is missing the standard PEM headers!`);
      }
    } else {
      console.log(`[FirebaseAdmin Diagnostic] Private Key is missing or empty!`);
    }

    if (!projectId) {
      console.error("getFirebaseAdmin: No Firebase Project ID found in config. Cannot initialize Admin SDK.");
      return null;
    }

    const options: admin.AppOptions = {
      projectId,
    };

    if (clientEmail && privateKey) {
      options.credential = admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      });

      firebaseAdminInstance = admin.initializeApp(options);
      console.log(`getFirebaseAdmin: Initialized successfully using Service Account for project: ${projectId}`);
      return firebaseAdminInstance;
    }

    console.warn("getFirebaseAdmin: Service Account credentials (clientEmail or privateKey) are missing. Falling back to Application Default Credentials...");
    firebaseAdminInstance = admin.initializeApp(options);
    return firebaseAdminInstance;
  } catch (error) {
    console.error("Failed to initialize firebase-admin SDK", error);
  }
  return null;
}

export function getAdminFirestore() {
  const adminApp = getFirebaseAdmin();
  if (adminApp) {
    return adminApp.firestore();
  }
  return null;
}
