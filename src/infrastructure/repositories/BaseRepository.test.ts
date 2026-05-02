import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseRepository } from './BaseRepository';
import * as firestore from 'firebase/firestore';
import { auth } from '../../lib/firebase';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ type: 'collection' })),
  doc: vi.fn(() => ({ type: 'doc' })),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-time'),
}));

vi.mock('../../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test-user-123', email: 'test@aimee.ai' }
  }
}));

interface TestEntity {
  id?: string;
  name: string;
  userId?: string;
}

describe('BaseRepository', () => {
  let repository: BaseRepository<TestEntity>;

  beforeEach(() => {
    repository = new BaseRepository<TestEntity>('users/{userId}/items');
    vi.clearAllMocks();
  });

  it('should correctly replace {userId} in path', async () => {
    const mockDocRef = { id: 'new-id' };
    vi.mocked(firestore.addDoc).mockResolvedValue(mockDocRef as any);

    await repository.create({ name: 'Test Object' });

    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'users/test-user-123/items');
  });

  it('should use customUserId if provided', async () => {
    vi.mocked(firestore.addDoc).mockResolvedValue({ id: 'id' } as any);

    await repository.create({ name: 'Shared Item' }, 'shared-space-id');

    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), 'users/shared-space-id/items');
  });

  it('should handle getById correctly', async () => {
    const mockSnap = {
      exists: () => true,
      id: 'item-1',
      data: () => ({ name: 'Fetched Item' })
    };
    vi.mocked(firestore.getDoc).mockResolvedValue(mockSnap as any);

    const result = await repository.getById('item-1');

    expect(result).toEqual({ id: 'item-1', name: 'Fetched Item' });
    expect(firestore.doc).toHaveBeenCalledWith(expect.anything(), 'users/test-user-123/items', 'item-1');
  });

  it('should handle list with constraints', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ name: 'A' }) },
      { id: '2', data: () => ({ name: 'B' }) }
    ];
    vi.mocked(firestore.getDocs).mockResolvedValue({ docs: mockDocs } as any);
    vi.mocked(firestore.query).mockReturnValue('mock-query' as any);

    const mockConstraint = { type: 'where' } as any;
    const result = await repository.list([mockConstraint]);

    expect(result).toHaveLength(2);
    expect(firestore.query).toHaveBeenCalledWith(expect.anything(), mockConstraint);
  });

  it('should handle update correctly', async () => {
    await repository.update('item-1', { name: 'Updated' });
    expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'Updated', updatedAt: 'server-time' })
    );
  });

  it('should handle delete correctly', async () => {
    await repository.delete('item-1');
    expect(firestore.deleteDoc).toHaveBeenCalledWith(expect.anything());
  });

  it('should throw and log on Firestore error', async () => {
    vi.mocked(firestore.addDoc).mockRejectedValue(new Error('Permission Denied'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(repository.create({ name: 'Fail' }))
      .rejects.toThrow('Permission Denied');
    
    expect(consoleSpy).toHaveBeenCalled();
  });
});
