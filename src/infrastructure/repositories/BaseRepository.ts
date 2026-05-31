import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  QueryConstraint,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase.js';

import { z, ZodTypeAny } from 'zod';
import { BaseEntity } from '../../domain/entities/BaseEntity.js';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export class BaseRepository<T extends Partial<BaseEntity> & { createdAt?: any; updatedAt?: any }> {
  protected collectionPath: string;
  protected schema?: ZodTypeAny;

  constructor(collectionPath: string, schema?: ZodTypeAny) {
    this.collectionPath = collectionPath;
    this.schema = schema;
  }

  protected handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error(`Firestore Error [${operationType}] at ${path}:`, JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  private sanitizeData(data: any): any {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    return sanitized;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, customUserId?: string): Promise<string> {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usuário não autenticado para criar documento.");

    if (this.schema) {
      try {
        // Validation might need to allow partials or handle server-side fields
        const validatedData = this.schema.parse({ ...data, userId, createdAt: new Date().toISOString() });
        // Use validated data if it was modified (e.g. default values or normalization)
        // But for Firestore we usually want to keep the original merged object
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Erro de Validação: ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        throw error;
      }
    }

    const path = this.collectionPath.replace('{userId}', userId);
    try {
      const docRef = await addDoc(collection(db, path), {
        ...this.sanitizeData(data),
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.CREATE, path);
      return '';
    }
  }

  async update(id: string, data: Partial<T>, customUserId?: string): Promise<void> {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usuário não autenticado para atualizar documento.");

    if (this.schema) {
      try {
        // For updates, we use partial validation if possible
        (this.schema as any).partial().parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Erro de Validação (Update): ${error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        throw error;
      }
    }

    const path = this.collectionPath.replace('{userId}', userId);
    const docRef = doc(db, path, id);
    try {
      await updateDoc(docRef, {
        ...this.sanitizeData(data),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      this.handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  }

  async delete(id: string, customUserId?: string): Promise<void> {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usuário não autenticado para deletar documento.");

    const path = this.collectionPath.replace('{userId}', userId);
    const docRef = doc(db, path, id);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      this.handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    }
  }

  async getById(id: string, customUserId?: string): Promise<T | null> {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usuário não autenticado.");

    const path = this.collectionPath.replace('{userId}', userId);
    const docRef = doc(db, path, id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
      return null;
    }
  }

  async list(constraints: QueryConstraint[] = [], customUserId?: string): Promise<T[]> {
    const userId = customUserId || auth.currentUser?.uid;
    if (!userId) throw new Error("Usuário não autenticado.");

    const path = this.collectionPath.replace('{userId}', userId);
    try {
      const q = query(collection(db, path), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
      this.handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
}
