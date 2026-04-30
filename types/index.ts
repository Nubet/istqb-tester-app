export type QuestionId = string;
export type AnswerId = 'A' | 'B' | 'C' | 'D';
export type Category = string;

export interface Question {
    id: QuestionId;
    text: string;
    options: Record<AnswerId, string>;
    correctAnswer: AnswerId;
    explanation: string;
    category: Category;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
    questionId: QuestionId;
    selectedAnswer: AnswerId | null;
    isCorrect: boolean;
    timeSpentSeconds: number;
}

export interface LearningSession {
    id: string;
    questionIds: QuestionId[];
    currentIndex: number;
    answers: Map<QuestionId, UserAnswer>;
}

export interface LearningSectionSummary {
    id: string;
    chapter: string;
    title: string;
    totalQuestions: number;
    masteredQuestions: number;
    wrongQuestions: number;
    progressPercentage: number;
    order: number;
}

export interface BookmarkedQuestion {
    questionId: QuestionId;
    source: 'exam' | 'learning';
    bookmarkedAt: Date;
    notes?: string;
}

export interface UserProgress {
    totalQuestionsAnswered: number;
    correctAnswers: number;
    examAttempts: number;
    averageScore: number;
    bookmarkedQuestionIds: QuestionId[];
    completedQuestionIds: QuestionId[];
    masteredQuestionIds: QuestionId[];
    categoryStats: Map<Category, CategoryProgress>;
    chapterMasteredQuestionIds: Map<Category, QuestionId[]>;
    learningAnswerResults: Map<QuestionId, boolean>;
}

export interface CategoryProgress {
    category: Category;
    totalQuestions: number;
    answeredCorrectly: number;
    answeredTotal: number;
}

export interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    category?: string;
    relatedTerms?: string[];
}

export interface GlossaryCategorySummary {
    category: string;
    count: number;
}

export interface FlashcardDeckSummary {
    id: string;
    title: string;
    totalCards: number;
    masteredCards: number;
    learningCards: number;
    progressPercentage: number;
}

export interface ExamConfig {
    totalQuestions: number;
    timeLimitMinutes: number;
    passingScore: number;
}

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
    totalQuestions: 40,
    timeLimitMinutes: 60,
    passingScore: 65,
};

export interface ExamResult {
    sessionId: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    passed: boolean;
    timeSpentMinutes: number;
    recommendations: string[];
    questionReviews: ExamQuestionReview[];
}

export interface ExamQuestionReview {
    questionId: QuestionId;
    questionNumber: number;
    category: Category;
    questionText: string;
    options: Record<AnswerId, string>;
    selectedAnswer: AnswerId | null;
    correctAnswer: AnswerId;
    isCorrect: boolean;
}
