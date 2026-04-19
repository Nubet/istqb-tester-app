import { getDb } from '../db/sqlite';
import type { KeyValueStorage } from './types';

export class SqliteKeyValueAdapter implements KeyValueStorage {
    async getItem(key: string): Promise<string | null> {
        const db = await getDb();
        const result = await db.getFirstAsync<{ value: string }>(
            'SELECT value FROM key_value_store WHERE key = ?',
            [key]
        );
        return result ? result.value : null;
    }

    async setItem(key: string, value: string): Promise<void> {
        const db = await getDb();
        await db.runAsync(
            'INSERT OR REPLACE INTO key_value_store (key, value) VALUES (?, ?)',
            [key, value]
        );
    }

    async removeItem(key: string): Promise<void> {
        const db = await getDb();
        await db.runAsync(
            'DELETE FROM key_value_store WHERE key = ?',
            [key]
        );
    }
}
