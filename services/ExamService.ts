import type { AnswerId, ExamResult, Question, QuestionId } from '../types';
import type { ExamSession } from './entities/ExamSession';
import { questionRepository, examSessionRepository, userProgressRepository } from '../repositories';
import { StartExamUseCase } from './usecases/exam/StartExam';
import { AnswerQuestionUseCase } from './usecases/exam/AnswerQuestion';
import { CompleteExamUseCase } from './usecases/exam/CompleteExam';

const startExamUseCase = new StartExamUseCase(questionRepository, examSessionRepository);
const answerQuestionUseCase = new AnswerQuestionUseCase(
    questionRepository,
    examSessionRepository,
    userProgressRepository
);
const completeExamUseCase = new CompleteExamUseCase(examSessionRepository, userProgressRepository);

export class ExamService {
    async getCurrentSession(): Promise<ExamSession | null> {
        return examSessionRepository.getCurrent();
    }

    async getSessionQuestions(questionIds: QuestionId[]): Promise<Question[]> {
        const allQuestions = await Promise.all(questionIds.map((id) => questionRepository.getById(id)));
        return allQuestions.filter((q): q is Question => q !== null);
    }

    async startExam(): Promise<ExamSession> {
        return startExamUseCase.execute();
    }

    async answerQuestion(sessionId: string, questionId: QuestionId, selectedAnswer: AnswerId) {
        return answerQuestionUseCase.execute(sessionId, questionId, selectedAnswer);
    }

    async completeExam(sessionId: string): Promise<ExamResult> {
        return completeExamUseCase.execute(sessionId);
    }

    async tickSession(session: ExamSession): Promise<void> {
        session.tick();
        await examSessionRepository.save(session);
    }
}
