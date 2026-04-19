import type { Question, QuestionId, Category } from '@/types';

export interface IQuestionRepository {
    getAll(): Promise<Question[]>;
    getById(id: QuestionId): Promise<Question | null>;
    getByIds(ids: QuestionId[]): Promise<Question[]>;
    getByCategory(category: Category): Promise<Question[]>;
    getRandom(count: number): Promise<Question[]>;
    getCategories(): Promise<Category[]>;
    getTotalCount(): Promise<number>;
}
