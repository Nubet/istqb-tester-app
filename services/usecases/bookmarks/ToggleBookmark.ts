import type { IUserProgressRepository } from '../../../repositories/contracts/IUserProgressRepository';
import type { QuestionId } from '../../../types';

export class ToggleBookmarkUseCase {
    constructor(private userProgressRepository: IUserProgressRepository) {}

    async execute(questionId: QuestionId, source: 'exam' | 'learning'): Promise<boolean> {
        const progress = await this.userProgressRepository.get();
        const isBookmarked = progress.toggleBookmark(questionId, source);
        await this.userProgressRepository.save(progress);
        return isBookmarked;
    }
}
