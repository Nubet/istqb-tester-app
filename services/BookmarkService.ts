import type { QuestionId } from '@/types';
import { userProgressRepository } from '@/repositories';
import { ToggleBookmarkUseCase } from './usecases/bookmarks/ToggleBookmark';

const toggleBookmarkUseCase = new ToggleBookmarkUseCase(userProgressRepository);

export class BookmarkService {
    async toggleBookmark(questionId: QuestionId, source: 'exam' | 'learning') {
        return toggleBookmarkUseCase.execute(questionId, source);
    }
}
