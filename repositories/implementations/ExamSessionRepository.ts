import type { IExamSessionRepository } from '../contracts/IExamSessionRepository';
import { ExamSession } from '../../services/entities/ExamSession';
import type { KeyValueStorage } from '../../infra/storage/types';
import { ExamSessionMapper } from '../mappers/ExamSessionMapper';

const CURRENT_SESSION_KEY = '@istqb_current_exam_session';
const SESSION_HISTORY_KEY = '@istqb_exam_history';

export class ExamSessionRepository implements IExamSessionRepository {
    constructor(private storage: KeyValueStorage) {}

    async getCurrent(): Promise<ExamSession | null> {
        const data = await this.storage.getItem(CURRENT_SESSION_KEY);
        if (!data) return null;

        try {
            const raw = JSON.parse(data);
            return ExamSessionMapper.toDomain(raw);
        } catch {
            return null;
        }
    }

    async save(session: ExamSession): Promise<void> {
        const raw = ExamSessionMapper.toRaw(session);
        await this.storage.setItem(CURRENT_SESSION_KEY, JSON.stringify(raw));

        if (session.isCompleted) {
            await this.addToHistory(session);
        }
    }

    async clear(): Promise<void> {
        await this.storage.removeItem(CURRENT_SESSION_KEY);
    }

    async getHistory(): Promise<ExamSession[]> {
        const data = await this.storage.getItem(SESSION_HISTORY_KEY);
        if (!data) return [];

        try {
            const rawList = JSON.parse(data);
            return rawList.map((raw: unknown) => ExamSessionMapper.toDomain(raw as Parameters<typeof ExamSessionMapper.toDomain>[0]));
        } catch {
            return [];
        }
    }

    private async addToHistory(session: ExamSession): Promise<void> {
        const history = await this.getHistory();
        history.push(session);
        // Keep only last 10 sessions
        const limitedHistory = history.slice(-10);
        await this.storage.setItem(SESSION_HISTORY_KEY, JSON.stringify(
            limitedHistory.map(s => ExamSessionMapper.toRaw(s))
        ));
    }
}
