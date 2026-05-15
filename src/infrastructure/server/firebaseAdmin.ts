import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseAdminInstance: admin.app.App | null = null;

export function getFirebaseAdmin() {
  if (firebaseAdminInstance) return firebaseAdminInstance;

  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      firebaseAdminInstance = admin.initializeApp({
        projectId: config.projectId,
        // When not providing a credential, it automatically uses Application Default Credentials
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
