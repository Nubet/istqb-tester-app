import type { QuestionId, AnswerId, Category } from '../../types';

export class Question {
    constructor(
        public readonly id: QuestionId,
        public readonly text: string,
        public readonly options: Record<AnswerId, string>,
        public readonly correctAnswer: AnswerId,
        public readonly explanation: string,
        public readonly category: Category,
        public readonly difficulty: 'easy' | 'medium' | 'hard'
    ) {}

    isCorrectAnswer(answer: AnswerId): boolean {
        return answer === this.correctAnswer;
    }

    getOptionText(answerId: AnswerId): string {
        return this.options[answerId];
    }
}
