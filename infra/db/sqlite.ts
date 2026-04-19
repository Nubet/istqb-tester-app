import * as SQLite from 'expo-sqlite';
import seedData from '@/data/questions.normalized.json';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (dbInstance) return dbInstance;
    
    dbInstance = await SQLite.openDatabaseAsync('istqb.db');
    await setupDatabase(dbInstance);
    return dbInstance;
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
    `);

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
            console.log('Database seeded successfully.');
        } finally {
            await statement.finalizeAsync();
        }
    }
}
