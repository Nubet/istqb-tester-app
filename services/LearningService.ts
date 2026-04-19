import type { LearningSession, Question } from '@/types';
import { questionRepository } from '@/repositories';
import { StartLearningSessionUseCase } from './usecases/learning/StartLearningSession';

const startLearningSessionUseCase = new StartLearningSessionUseCase(questionRepository);

export class LearningService {
    async getSections(): Promise<string[]> {
        return questionRepository.getCategories();
    }

    async startSession(category: string): Promise<LearningSession> {
        return startLearningSessionUseCase.execute(category);
    }

    async getSessionQuestions(questionIds: string[]): Promise<Question[]> {
        return questionRepository.getByIds(questionIds);
    }
}
