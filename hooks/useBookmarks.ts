import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService, bookmarkService } from '../services';
import { UserProgress } from '../services/entities/UserProgress';
import type { BookmarkedQuestion } from '../types';

function reconstructUserProgress(raw: unknown): UserProgress {
    if (raw instanceof UserProgress) {
        return raw;
    }

    if (!raw || typeof raw !== 'object') {
        return new UserProgress();
    }

    const data = raw as Record<string, unknown>;

    const bookmarkedQuestionIds = Array.isArray(data.bookmarkedQuestionIds)
        ? data.bookmarkedQuestionIds
        : [];

    const bookmarks = new Map<string, BookmarkedQuestion>();
    bookmarkedQuestionIds.forEach((id: string) => {
        bookmarks.set(id, {
            questionId: id,
            source: 'learning',
            bookmarkedAt: new Date(),
        });
    });

    return new UserProgress(
        (data.totalQuestionsAnswered as number) || 0,
        (data.correctAnswers as number) || 0,
        (data.examAttempts as number) || 0,
        (data.averageScore as number) || 0,
        bookmarkedQuestionIds,
        Array.isArray(data.completedQuestionIds) ? data.completedQuestionIds : [],
        new Map(Array.isArray(data.categoryStats) ? data.categoryStats : []),
        bookmarks
    );
}

export function useBookmarks() {
    const queryClient = useQueryClient();

    const { data: rawProgress } = useQuery({
        queryKey: ['userProgress'],
        queryFn: () => progressService.getProgress(),
    });

    const progress = reconstructUserProgress(rawProgress);

    const toggleBookmark = useMutation({
        mutationFn: ({ questionId, source }: { questionId: string; source: 'exam' | 'learning' }) =>
            bookmarkService.toggleBookmark(questionId, source),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProgress'] });
        },
    });

    const bookmarks: BookmarkedQuestion[] = progress.getAllBookmarks();

    return {
        bookmarks,
        isEmpty: bookmarks.length === 0,
        toggleBookmark: toggleBookmark.mutate,
        isBookmarked: (questionId: string) => progress.isBookmarked(questionId),
    };
}
