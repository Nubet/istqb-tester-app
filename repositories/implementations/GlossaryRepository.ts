import { getDb } from '@/infra/db/sqlite';
import { GlossaryTerm } from '@/types';

export interface IGlossaryRepository {
    getAll(): Promise<GlossaryTerm[]>;
    search(query: string): Promise<GlossaryTerm[]>;
    getCategories(): Promise<string[]>;
    getByCategory(category: string): Promise<GlossaryTerm[]>;
    getCategorySummaries(): Promise<{ category: string; count: number }[]>;
}

export class GlossaryRepository implements IGlossaryRepository {
    async getAll(): Promise<GlossaryTerm[]> {
        const db = await getDb();
        const results = await db.getAllAsync<{ id: string, term: string, definition: string, category: string | null }>(
            'SELECT * FROM glossary ORDER BY term ASC'
        );
        return results.map(row => ({
            id: row.id,
            term: row.term,
            definition: row.definition,
            category: row.category ?? undefined
        }));
    }

    async search(query: string): Promise<GlossaryTerm[]> {
        if (!query || query.trim() === '') {
            return this.getAll();
        }

        const db = await getDb();
        const searchTerm = `%${query.trim()}%`;
        const results = await db.getAllAsync<{ id: string, term: string, definition: string, category: string | null }>(
            'SELECT * FROM glossary WHERE term LIKE ? OR definition LIKE ? ORDER BY term ASC',
            [searchTerm, searchTerm]
        );
        
        return results.map(row => ({
            id: row.id,
            term: row.term,
            definition: row.definition,
            category: row.category ?? undefined
        }));
    }

    async getCategories(): Promise<string[]> {
        const db = await getDb();
        const results = await db.getAllAsync<{ category: string | null }>(
            "SELECT DISTINCT category FROM glossary WHERE category IS NOT NULL AND TRIM(category) != '' ORDER BY category COLLATE NOCASE ASC"
        );

        return results
            .map((row) => row.category)
            .filter((category): category is string => !!category);
    }

    async getByCategory(category: string): Promise<GlossaryTerm[]> {
        const db = await getDb();
        const results = await db.getAllAsync<{ id: string, term: string, definition: string, category: string | null }>(
            'SELECT * FROM glossary WHERE category = ? ORDER BY term ASC',
            [category]
        );

        return results.map((row) => ({
            id: row.id,
            term: row.term,
            definition: row.definition,
            category: row.category ?? undefined,
        }));
    }

    async getCategorySummaries(): Promise<{ category: string; count: number }[]> {
        const db = await getDb();
        const results = await db.getAllAsync<{ category: string | null; count: number }>(
            "SELECT category, COUNT(*) as count FROM glossary WHERE category IS NOT NULL AND TRIM(category) != '' GROUP BY category"
        );

        return results
            .filter((row): row is { category: string; count: number } => !!row.category)
            .map((row) => ({
                category: row.category,
                count: row.count,
            }));
    }
}
