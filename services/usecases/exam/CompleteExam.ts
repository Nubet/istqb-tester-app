import type { IExamSessionRepository, IUserProgressRepository, IQuestionRepository } from '@/repositories/contracts';
import type { ExamResult } from '@/types';

export class CompleteExamUseCase {
    constructor(
        private questionRepository: IQuestionRepository,
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

        const questionReviews = await Promise.all(
            session.questions.map(async (questionId, index) => {
                const question = await this.questionRepository.getById(questionId);
                if (!question) {
                    return null;
                }

                const answer = session.getAnswer(questionId);
                return {
                    questionId,
                    questionNumber: index + 1,
                    category: question.category,
                    questionText: question.text,
                    options: question.options,
                    selectedAnswer: answer?.selectedAnswer ?? null,
                    correctAnswer: question.correctAnswer,
                    isCorrect: answer?.isCorrect ?? false,
                };
            })
        );

        return {
            sessionId: session.id,
            totalQuestions,
            correctAnswers,
            score,
            passed: score >= 65,
            timeSpentMinutes,
            recommendations: this.generateRecommendations(score, correctAnswers, totalQuestions),
            questionReviews: questionReviews.filter((item) => item !== null),
        };
    }

    private generateRecommendations(score: number, correct: number, total: number): string[] {
        const recommendations: string[] = [];
        const incorrect = total - correct;

        if (score < 65) {
            recommendations.push('Wróć do podstawowych pojęć ISTQB');
        }
        if (incorrect > 10) {
            recommendations.push('Przerób więcej przykładowych pytań');
        }
        if (score >= 80) {
            recommendations.push('Jesteś gotowy do egzaminu!');
        }

        return recommendations;
    }
}
