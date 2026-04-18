import { ExamSession } from '../../services/entities/ExamSession';
import type { UserAnswer } from '../../types';

interface ExamSessionRaw {
    id: string;
    startedAt: string;
    questions: string[];
    timeRemainingSeconds: number;
    completedAt: string | null;
    answers: [string, UserAnswer][];
    isCompleted: boolean;
}

export class ExamSessionMapper {
    static toDomain(raw: ExamSessionRaw): ExamSession {
        return new ExamSession(
            raw.id,
            new Date(raw.startedAt),
            raw.questions,
            raw.timeRemainingSeconds,
            raw.completedAt ? new Date(raw.completedAt) : null,
            new Map(raw.answers),
            raw.isCompleted
        );
    }

    static toRaw(session: ExamSession): ExamSessionRaw {
        return {
            id: session.id,
            startedAt: session.startedAt.toISOString(),
            questions: session.questions,
            timeRemainingSeconds: session.timeRemainingSeconds,
            completedAt: session.completedAt?.toISOString() ?? null,
            answers: Array.from(session.getAllAnswers().entries()),
            isCompleted: session.isCompleted,
        };
    }
}
