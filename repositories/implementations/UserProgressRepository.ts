import type { IUserProgressRepository } from '@/repositories/contracts';
import { UserProgress } from '@/services/entities';
import type { KeyValueStorage } from '@/infra/storage/types';
import { UserProgressMapper } from '../mappers/UserProgressMapper';

const STORAGE_KEY = '@istqb_user_progress';

export class UserProgressRepository implements IUserProgressRepository {
    constructor(private storage: KeyValueStorage) {}

    async get(): Promise<UserProgress> {
        const data = await this.storage.getItem(STORAGE_KEY);
        if (!data) {
            return new UserProgress();
        }

        try {
            const raw = JSON.parse(data);
            return UserProgressMapper.toDomain(raw);
        } catch {
            return new UserProgress();
        }
    }

    async save(progress: UserProgress): Promise<void> {
        const raw = UserProgressMapper.toRaw(progress);
        await this.storage.setItem(STORAGE_KEY, JSON.stringify(raw));
    }

    async clear(): Promise<void> {
        await this.storage.removeItem(STORAGE_KEY);
    }
}
