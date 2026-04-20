import type { IQuestionRepository } from '@/repositories/contracts';
import type { LearningSession } from '@/types';

export class StartLearningSessionUseCase {
    constructor(private questionRepository: IQuestionRepository) {}

    async execute(category?: string): Promise<LearningSession> {
        const questions = category
            ? await this.questionRepository.getByCategory(category)
            : await this.questionRepository.getAll();

        return {
            id: `learn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questionIds: questions.map(q => q.id),
            currentIndex: 0,
            answers: new Map(),
        };
    }
}
