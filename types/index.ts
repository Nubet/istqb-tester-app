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
    categoryStats: Map<Category, CategoryProgress>;
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
    relatedTerms?: string[];
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
}
