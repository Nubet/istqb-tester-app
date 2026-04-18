import type { IQuestionRepository } from '../../../repositories/contracts/IQuestionRepository';
import type { LearningSession } from '../../../types';

const LEARNING_SESSION_SIZE = 10;

export class StartLearningSessionUseCase {
    constructor(private questionRepository: IQuestionRepository) {}

    async execute(category?: string): Promise<LearningSession> {
        const questions = category
            ? (await this.questionRepository.getByCategory(category)).slice(0, LEARNING_SESSION_SIZE)
            : await this.questionRepository.getRandom(LEARNING_SESSION_SIZE);

        return {
            id: `learn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questionIds: questions.map(q => q.id),
            currentIndex: 0,
            answers: new Map(),
        };
    }
}
