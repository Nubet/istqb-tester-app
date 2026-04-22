import { UserProgress } from '@/services/entities';
import type { CategoryProgress, BookmarkedQuestion } from '@/types';

interface UserProgressRaw {
    totalQuestionsAnswered: number;
    correctAnswers: number;
    examAttempts: number;
    averageScore: number;
    bookmarkedQuestionIds: string[];
    completedQuestionIds: string[];
    masteredQuestionIds: string[];
    categoryStats: [string, CategoryProgress][];
    chapterMasteredQuestionIds: [string, string[]][];
    bookmarks: [string, BookmarkedQuestion][];
    learningAnswerResults: [string, boolean][];
}

export class UserProgressMapper {
    static toDomain(raw: UserProgressRaw): UserProgress {
        const bookmarkMap = new Map<string, BookmarkedQuestion>(raw.bookmarks || []);

        return new UserProgress(
            raw.totalQuestionsAnswered || 0,
            raw.correctAnswers || 0,
            raw.examAttempts || 0,
            raw.averageScore || 0,
            raw.bookmarkedQuestionIds || [],
            raw.completedQuestionIds || [],
            raw.masteredQuestionIds || [],
            new Map(raw.categoryStats || []),
            new Map(raw.chapterMasteredQuestionIds || []),
            bookmarkMap,
            new Map(raw.learningAnswerResults || [])
        );
    }

    static toRaw(progress: UserProgress): UserProgressRaw {
        return {
            totalQuestionsAnswered: progress.totalQuestionsAnswered,
            correctAnswers: progress.correctAnswers,
            examAttempts: progress.examAttempts,
            averageScore: progress.averageScore,
            bookmarkedQuestionIds: progress.bookmarkedQuestionIds,
            completedQuestionIds: progress.completedQuestionIds,
            masteredQuestionIds: progress.masteredQuestionIds,
            categoryStats: Array.from(progress.categoryStats.entries()),
            chapterMasteredQuestionIds: Array.from(progress.getChapterMasteredQuestionIds().entries()),
            bookmarks: progress.getAllBookmarks().map((b) => [b.questionId, b]),
            learningAnswerResults: Array.from(progress.getLearningAnswerResults().entries()),
        };
    }
}
