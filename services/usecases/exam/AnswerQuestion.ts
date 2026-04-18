import type { IQuestionRepository } from '@/repositories/contracts';
import type { IExamSessionRepository } from '@/repositories/contracts';
import type { IUserProgressRepository } from '@/repositories/contracts';
import type { QuestionId, AnswerId, UserAnswer } from '@/types';
import { ExamSession } from '@/services/entities';

export class AnswerQuestionUseCase {
    constructor(
        private questionRepository: IQuestionRepository,
        private examSessionRepository: IExamSessionRepository,
        private userProgressRepository: IUserProgressRepository
    ) {}

    async execute(
        sessionId: string,
        questionId: QuestionId,
        selectedAnswer: AnswerId
    ): Promise<{ isCorrect: boolean; session: ExamSession }> {
        const session = await this.examSessionRepository.getCurrent();
        if (!session || session.id !== sessionId) {
            throw new Error('Exam session not found');
        }

        const question = await this.questionRepository.getById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        const isCorrect = question.correctAnswer === selectedAnswer;

        const answer: UserAnswer = {
            questionId,
            selectedAnswer,
            isCorrect,
            timeSpentSeconds: 0,
        };

        session.answerQuestion(questionId, answer);
        await this.examSessionRepository.save(session);

        const progress = await this.userProgressRepository.get();
        progress.recordAnswer(questionId, isCorrect);
        progress.updateCategoryProgress(question.category, isCorrect);
        await this.userProgressRepository.save(progress);

        return { isCorrect, session };
    }
}
