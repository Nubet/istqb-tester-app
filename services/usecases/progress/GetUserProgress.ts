import type { IUserProgressRepository } from '../../../repositories/contracts/IUserProgressRepository';
import type { IQuestionRepository } from '../../../repositories/contracts/IQuestionRepository';
import { UserProgress } from '../../entities/UserProgress';

export interface ProgressSummary {
    progress: UserProgress;
    completionPercentage: number;
    totalQuestions: number;
}

export class GetUserProgressUseCase {
    constructor(
        private userProgressRepository: IUserProgressRepository,
        private questionRepository: IQuestionRepository
    ) {}

    async execute(): Promise<ProgressSummary> {
        const [progress, totalQuestions] = await Promise.all([
            this.userProgressRepository.get(),
            this.questionRepository.getTotalCount(),
        ]);

        return {
            progress,
            completionPercentage: progress.getCompletionPercentage(totalQuestions),
            totalQuestions,
        };
    }
}
