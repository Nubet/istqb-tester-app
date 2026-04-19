import type { IQuestionRepository } from '@/repositories/contracts';
import type { Question, QuestionId, Category } from '@/types';
import { getDb } from '@/infra/db/sqlite';

function mapRowToQuestion(row: any): Question {
    return {
        id: row.id,
        text: row.text,
        options: {
            A: row.optionA,
            B: row.optionB,
            C: row.optionC,
            D: row.optionD,
        },
        correctAnswer: row.correctAnswer as 'A' | 'B' | 'C' | 'D',
        explanation: row.explanation,
        category: row.category,
        difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
    };
}

export class QuestionRepository implements IQuestionRepository {
    async getAll(): Promise<Question[]> {
        const db = await getDb();
        const rows = await db.getAllAsync<any>('SELECT * FROM questions');
        return rows.map(mapRowToQuestion);
    }

    async getById(id: QuestionId): Promise<Question | null> {
        const db = await getDb();
        const row = await db.getFirstAsync<any>('SELECT * FROM questions WHERE id = ?', [id]);
        if (!row) return null;
        return mapRowToQuestion(row);
    }

    async getByIds(ids: QuestionId[]): Promise<Question[]> {
        if (ids.length === 0) return [];
        const db = await getDb();
        const placeholders = ids.map(() => '?').join(',');
        const rows = await db.getAllAsync<any>(`SELECT * FROM questions WHERE id IN (${placeholders})`, ids);
        return rows.map(mapRowToQuestion);
    }

    async getByCategory(category: Category): Promise<Question[]> {
        const db = await getDb();
        const rows = await db.getAllAsync<any>('SELECT * FROM questions WHERE category = ?', [category]);
        return rows.map(mapRowToQuestion);
    }

    async getRandom(count: number): Promise<Question[]> {
        const db = await getDb();
        const rows = await db.getAllAsync<any>('SELECT * FROM questions ORDER BY RANDOM() LIMIT ?', [count]);
        return rows.map(mapRowToQuestion);
    }

    async getCategories(): Promise<Category[]> {
        const db = await getDb();
        const rows = await db.getAllAsync<{ category: string }>('SELECT DISTINCT category FROM questions ORDER BY category ASC');
        return rows.map(r => r.category);
    }

    async getTotalCount(): Promise<number> {
        const db = await getDb();
        const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM questions');
        return row?.count || 0;
    }
}
