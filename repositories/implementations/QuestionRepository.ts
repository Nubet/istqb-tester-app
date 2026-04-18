import type { IQuestionRepository } from '@/repositories/contracts';
import type { Question, QuestionId, Category } from '@/types';
import { mockQuestions } from '@/data/mockData';

export class QuestionRepository implements IQuestionRepository {
    private questions: Question[] = mockQuestions;

    async getAll(): Promise<Question[]> {
        return this.questions;
    }

    async getById(id: QuestionId): Promise<Question | null> {
        return this.questions.find(q => q.id === id) || null;
    }

    async getByCategory(category: Category): Promise<Question[]> {
        return this.questions.filter(q => q.category === category);
    }

    async getRandom(count: number): Promise<Question[]> {
        const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    async getCategories(): Promise<Category[]> {
        const categories = new Set(this.questions.map(q => q.category));
        return Array.from(categories);
    }

    async getTotalCount(): Promise<number> {
        return this.questions.length;
    }
}
