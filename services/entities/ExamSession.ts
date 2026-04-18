import type { QuestionId, UserAnswer } from '@/types';
import { DEFAULT_EXAM_CONFIG } from '@/types';

export class ExamSession {
    constructor(
        public readonly id: string,
        public readonly startedAt: Date,
        public readonly questions: QuestionId[],
        public timeRemainingSeconds: number = DEFAULT_EXAM_CONFIG.timeLimitMinutes * 60,
        public completedAt: Date | null = null,
        private answers: Map<QuestionId, UserAnswer> = new Map(),
        public isCompleted: boolean = false
    ) {}

    answerQuestion(questionId: QuestionId, answer: UserAnswer): void {
        this.answers.set(questionId, answer);
    }

    getAnswer(questionId: QuestionId): UserAnswer | undefined {
        return this.answers.get(questionId);
    }

    getAllAnswers(): Map<QuestionId, UserAnswer> {
        return new Map(this.answers);
    }

    getAnsweredCount(): number {
        return Array.from(this.answers.values()).filter(a => a.selectedAnswer !== null).length;
    }

    getCorrectCount(): number {
        return Array.from(this.answers.values()).filter(a => a.isCorrect).length;
    }

    calculateScore(): number {
        const total = this.questions.length;
        if (total === 0) return 0;
        return Math.round((this.getCorrectCount() / total) * 100);
    }

    complete(): void {
        this.isCompleted = true;
        this.completedAt = new Date();
    }

    tick(): boolean {
        if (this.isCompleted) return false;
        this.timeRemainingSeconds = Math.max(0, this.timeRemainingSeconds - 1);
        return this.timeRemainingSeconds > 0;
    }

    formatTimeRemaining(): string {
        const minutes = Math.floor(this.timeRemainingSeconds / 60);
        const seconds = this.timeRemainingSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}
