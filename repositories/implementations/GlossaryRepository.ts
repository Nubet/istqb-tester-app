import { getDb } from '@/infra/db/sqlite';
import { GlossaryTerm } from '@/types';

export interface IGlossaryRepository {
    getAll(): Promise<GlossaryTerm[]>;
    search(query: string): Promise<GlossaryTerm[]>;
    getCategories(): Promise<string[]>;
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
}
