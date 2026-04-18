import { ExamSession } from '@/services/entities';
import type { IQuestionRepository } from '@/repositories/contracts';
import type { IExamSessionRepository } from '@/repositories/contracts';
import { DEFAULT_EXAM_CONFIG } from '@/types';

export class StartExamUseCase {
    constructor(
        private questionRepository: IQuestionRepository,
        private examSessionRepository: IExamSessionRepository
    ) {}

    async execute(): Promise<ExamSession> {
        const questions = await this.questionRepository.getRandom(DEFAULT_EXAM_CONFIG.totalQuestions);
        const questionIds = questions.map(q => q.id);

        const session = new ExamSession(
            this.generateSessionId(),
            new Date(),
            questionIds,
            DEFAULT_EXAM_CONFIG.timeLimitMinutes * 60
        );

        await this.examSessionRepository.save(session);
        return session;
    }

    private generateSessionId(): string {
        return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
