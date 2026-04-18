import { questionRepository, userProgressRepository } from '../repositories';
import { GetUserProgressUseCase } from './usecases/progress/GetUserProgress';

const getUserProgressUseCase = new GetUserProgressUseCase(userProgressRepository, questionRepository);

export class ProgressService {
    async getSummary() {
        return getUserProgressUseCase.execute();
    }

    async getProgress() {
        return userProgressRepository.get();
    }
}
