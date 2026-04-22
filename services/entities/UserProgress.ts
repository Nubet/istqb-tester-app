import type { QuestionId, Category, CategoryProgress, BookmarkedQuestion } from '@/types';

export class UserProgress {
    constructor(
        public totalQuestionsAnswered: number = 0,
        public correctAnswers: number = 0,
        public examAttempts: number = 0,
        public averageScore: number = 0,
        public bookmarkedQuestionIds: QuestionId[] = [],
        public completedQuestionIds: QuestionId[] = [],
        public masteredQuestionIds: QuestionId[] = [],
        public categoryStats: Map<Category, CategoryProgress> = new Map(),
        public chapterMasteredQuestionIds: Map<Category, QuestionId[]> = new Map(),
        private bookmarks: Map<QuestionId, BookmarkedQuestion> = new Map(),
        private learningAnswerResults: Map<QuestionId, boolean> = new Map()
    ) {}

    recordAnswer(questionId: QuestionId, isCorrect: boolean): void {
        if (!this.completedQuestionIds.includes(questionId)) {
            this.completedQuestionIds.push(questionId);
        }
        this.totalQuestionsAnswered++;
        if (isCorrect) {
            this.correctAnswers++;
        }
        this.recalculateAccuracy();
    }

    private recalculateAccuracy(): void {
        if (this.totalQuestionsAnswered === 0) {
            this.averageScore = 0;
            return;
        }
        this.averageScore = Math.round((this.correctAnswers / this.totalQuestionsAnswered) * 100);
    }

    recordExamAttempt(score: number): void {
        this.examAttempts++;
        this.averageScore = Math.round(
            (this.averageScore * (this.examAttempts - 1) + score) / this.examAttempts
        );
    }

    toggleBookmark(questionId: QuestionId, source: 'exam' | 'learning'): boolean {
        if (this.bookmarks.has(questionId)) {
            this.bookmarks.delete(questionId);
            this.bookmarkedQuestionIds = this.bookmarkedQuestionIds.filter(id => id !== questionId);
            return false;
        } else {
            const bookmark: BookmarkedQuestion = {
                questionId,
                source,
                bookmarkedAt: new Date(),
            };
            this.bookmarks.set(questionId, bookmark);
            this.bookmarkedQuestionIds.push(questionId);
            return true;
        }
    }

    isBookmarked(questionId: QuestionId): boolean {
        return this.bookmarks.has(questionId);
    }

    getBookmark(questionId: QuestionId): BookmarkedQuestion | undefined {
        return this.bookmarks.get(questionId);
    }

    getAllBookmarks(): BookmarkedQuestion[] {
        return Array.from(this.bookmarks.values());
    }

    recordLearningAnswer(questionId: QuestionId, isCorrect: boolean): void {
        this.learningAnswerResults.set(questionId, isCorrect);
    }

    recordMasteredQuestion(questionId: QuestionId, category: Category): void {
        if (!this.masteredQuestionIds.includes(questionId)) {
            this.masteredQuestionIds.push(questionId);
        }

        const currentChapterMastered = this.chapterMasteredQuestionIds.get(category) ?? [];
        if (!currentChapterMastered.includes(questionId)) {
            this.chapterMasteredQuestionIds.set(category, [...currentChapterMastered, questionId]);
        }
    }

    getLearningAnswerResult(questionId: QuestionId): boolean | undefined {
        return this.learningAnswerResults.get(questionId);
    }

    getLearningAnswerResults(): Map<QuestionId, boolean> {
        return new Map(this.learningAnswerResults);
    }

    getChapterMasteredQuestionIds(): Map<Category, QuestionId[]> {
        return new Map(this.chapterMasteredQuestionIds);
    }

    updateCategoryProgress(category: Category, isCorrect: boolean): void {
        const current = this.categoryStats.get(category) || {
            category,
            totalQuestions: 0,
            answeredCorrectly: 0,
            answeredTotal: 0,
        };

        current.answeredTotal++;
        if (isCorrect) {
            current.answeredCorrectly++;
        }

        this.categoryStats.set(category, current);
    }

    getCompletionPercentage(totalQuestions: number): number {
        if (totalQuestions === 0) return 0;
        return Math.round((this.masteredQuestionIds.length / totalQuestions) * 100);
    }
}
