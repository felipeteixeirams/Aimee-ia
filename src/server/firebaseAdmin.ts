import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config as appConfig } from '../lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseAdminInstance: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (firebaseAdminInstance) return firebaseAdminInstance;

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      const clientEmail = appConfig.firebaseAdmin.clientEmail || process.env.FIREBASE_CLIENT_EMAIL || '';
      let privateKey = appConfig.firebaseAdmin.privateKey || process.env.FIREBASE_PRIVATE_KEY || '';
      
      const options: admin.AppOptions = {
        projectId: config.projectId,
      };

      if (clientEmail && privateKey) {
        options.credential = admin.credential.cert({
          projectId: config.projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        });
        
        firebaseAdminInstance = admin.initializeApp(options);
        return firebaseAdminInstance;
      }
      
      console.warn("getFirebaseAdmin: No service account credentials found in environment or config. Using Application Default Credentials...");
      firebaseAdminInstance = admin.initializeApp({
        projectId: config.projectId,
      });
      return firebaseAdminInstance;
    }
  } catch (error) {
    console.error("Failed to initialize firebase-admin", error);
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
