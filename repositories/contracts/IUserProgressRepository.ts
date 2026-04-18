import type { UserProgress } from '../../services/entities/UserProgress';

export interface IUserProgressRepository {
    get(): Promise<UserProgress>;
    save(progress: UserProgress): Promise<void>;
    clear(): Promise<void>;
}
