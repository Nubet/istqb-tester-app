import { questionRepository, userProgressRepository } from '@/repositories';
import { GetUserProgressUseCase } from './usecases/progress/GetUserProgress';

const getUserProgressUseCase = new GetUserProgressUseCase(userProgressRepository, questionRepository);

export class ProgressService {
    async getSummary() {
        return getUserProgressUseCase.execute();
    }

    async getProgress() {
        return userProgressRepository.get();
    }

    async recordLearningAnswer(questionId: string, category: string, isCorrect: boolean): Promise<void> {
        const progress = await userProgressRepository.get();
        progress.recordLearningAnswer(questionId, isCorrect);
        if (isCorrect) {
            progress.recordMasteredQuestion(questionId, category);
        }
        await userProgressRepository.save(progress);
    }
}
