import type { IExamSessionRepository } from '../../../repositories/contracts/IExamSessionRepository';
import type { IUserProgressRepository } from '../../../repositories/contracts/IUserProgressRepository';
import type { ExamResult } from '../../../types';

export class CompleteExamUseCase {
    constructor(
        private examSessionRepository: IExamSessionRepository,
        private userProgressRepository: IUserProgressRepository
    ) {}

    async execute(sessionId: string): Promise<ExamResult> {
        const session = await this.examSessionRepository.getCurrent();
        if (!session || session.id !== sessionId) {
            throw new Error('Exam session not found');
        }

        session.complete();
        await this.examSessionRepository.save(session);

        const score = session.calculateScore();
        const totalQuestions = session.questions.length;
        const correctAnswers = session.getCorrectCount();
        const timeSpentMinutes = Math.round(
            (new Date().getTime() - session.startedAt.getTime()) / 1000 / 60
        );

        const progress = await this.userProgressRepository.get();
        progress.recordExamAttempt(score);
        await this.userProgressRepository.save(progress);

        return {
            sessionId: session.id,
            totalQuestions,
            correctAnswers,
            score,
            passed: score >= 65,
            timeSpentMinutes,
            recommendations: this.generateRecommendations(score, correctAnswers, totalQuestions),
        };
    }

    private generateRecommendations(score: number, correct: number, total: number): string[] {
        const recommendations: string[] = [];
        const incorrect = total - correct;

        if (score < 65) {
            recommendations.push('Review fundamental ISTQB concepts');
        }
        if (incorrect > 10) {
            recommendations.push('Practice with more sample questions');
        }
        if (score >= 80) {
            recommendations.push('You are ready for the exam!');
        }

        return recommendations;
    }
}
