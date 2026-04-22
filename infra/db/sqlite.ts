import * as SQLite from 'expo-sqlite';
import seedData from '@/data/questions.normalized.json';
import glossaryData from '@/data/glosariusz-v2.json';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) return dbInstance;

    const db = await SQLite.openDatabaseAsync('istqb.db');

    try {
        await setupDatabase(db);
        dbInstance = db;
        return db;
    } catch (error) {
        dbInstance = null;
        await db.closeAsync();
        throw error;
    }
}

async function setupDatabase(db: SQLite.SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS questions (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            optionA TEXT NOT NULL,
            optionB TEXT NOT NULL,
            optionC TEXT NOT NULL,
            optionD TEXT NOT NULL,
            correctAnswer TEXT NOT NULL,
            explanation TEXT NOT NULL,
            category TEXT NOT NULL,
            difficulty TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

        CREATE TABLE IF NOT EXISTS key_value_store (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS glossary (
            id TEXT PRIMARY KEY,
            term TEXT NOT NULL,
            definition TEXT NOT NULL,
            category TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_glossary_term ON glossary(term);
    `);

    const glossaryTableInfo = await db.getAllAsync<{ name: string }>('PRAGMA table_info(glossary)');
    const hasCategoryColumn = glossaryTableInfo.some((column) => column.name === 'category');

    if (!hasCategoryColumn) {
        await db.execAsync('ALTER TABLE glossary ADD COLUMN category TEXT');
    }

    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary(category);');

    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM questions');
    if (result && result.count === 0) {
        console.log('Seeding database with', seedData.items.length, 'questions...');

        const statement = await db.prepareAsync(`
            INSERT INTO questions (
                id, text, optionA, optionB, optionC, optionD,
                correctAnswer, explanation, category, difficulty
            ) VALUES (
                $id, $text, $a, $b, $c, $d, $correct, $exp, $cat, $diff
            )
        `);

        try {
            await db.withTransactionAsync(async () => {
                for (const q of seedData.items) {
                    await statement.executeAsync({
                        $id: q.id,
                        $text: q.text,
                        $a: q.options.A,
                        $b: q.options.B,
                        $c: q.options.C,
                        $d: q.options.D,
                        $correct: q.correctAnswer,
                        $exp: q.explanation,
                        $cat: q.category,
                        $diff: q.difficulty
                    });
                }
            });
            console.log('Questions seeded successfully.');
        } finally {
            await statement.finalizeAsync();
        }
    }

    const glossaryResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM glossary');
    if (glossaryResult && glossaryResult.count === 0) {
        console.log('Seeding database with glossary terms');
        
        const statement = await db.prepareAsync(`
            INSERT INTO glossary (id, term, definition, category) VALUES ($id, $term, $definition, $category)
        `);
        
        try {
            await db.withTransactionAsync(async () => {
                for (const row of glossaryData.values) {
                    // ["1", "Term", "Definition"] ...
                    if (row.length >= 3) {
                        await statement.executeAsync({
                            $id: row[0],
                            $term: row[1],
                            $definition: row[2],
                            $category: row[3] ?? null
                        });
                    }
                }
            });
            console.log('Glossary seeded successfully.');
        } finally {
            await statement.finalizeAsync();
        }
    } else {
        const missingCategoryResult = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM glossary WHERE category IS NULL OR TRIM(category) = ''"
        );

        if (missingCategoryResult && missingCategoryResult.count > 0) {
            const statement = await db.prepareAsync(`
                UPDATE glossary
                SET category = $category
                WHERE id = $id AND (category IS NULL OR TRIM(category) = '')
            `);

            try {
                await db.withTransactionAsync(async () => {
                    for (const row of glossaryData.values) {
                        if (row.length >= 4) {
                            await statement.executeAsync({
                                $id: row[0],
                                $category: row[3]
                            });
                        }
                    }
                });
                console.log('Glossary categories backfilled successfully.');
            } finally {
                await statement.finalizeAsync();
            }
        }
    }
}
