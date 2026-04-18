import type { ExamSession } from '@/services/entities';

export interface IExamSessionRepository {
    getCurrent(): Promise<ExamSession | null>;
    save(session: ExamSession): Promise<void>;
    clear(): Promise<void>;
    getHistory(): Promise<ExamSession[]>;
}
