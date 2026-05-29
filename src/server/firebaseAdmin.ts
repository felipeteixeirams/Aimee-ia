import admin from 'firebase-admin';
import { config as appConfig } from '../lib/config.js';

let firebaseAdminInstance: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (firebaseAdminInstance) return firebaseAdminInstance;

  try {
    const projectId = appConfig.firebaseAdmin.projectId;
    const clientEmail = appConfig.firebaseAdmin.clientEmail;
    const privateKey = appConfig.firebaseAdmin.privateKey;

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
