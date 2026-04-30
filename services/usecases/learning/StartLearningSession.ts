import type { IQuestionRepository, IUserProgressRepository } from '@/repositories/contracts';
import type { LearningSession } from '@/types';

export class StartLearningSessionUseCase {
    constructor(
        private questionRepository: IQuestionRepository,
        private userProgressRepository: IUserProgressRepository
    ) {}

    async execute(categories?: string | string[], mode: 'all' | 'wrong' = 'all'): Promise<LearningSession> {
        let questions = await this.questionRepository.getAll();

        if (categories) {
            const selected = Array.isArray(categories) ? categories : [categories];
            const selectedSet = new Set(selected);
            questions = questions.filter((question) => selectedSet.has(question.category));
        }

        if (mode === 'wrong') {
            const progress = await this.userProgressRepository.get();
            questions = questions.filter(q => progress.getLearningAnswerResult(q.id) === false);
        }

        return {
            id: `learn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            questionIds: questions.map(q => q.id),
            currentIndex: 0,
            answers: new Map(),
        };
    }
}
