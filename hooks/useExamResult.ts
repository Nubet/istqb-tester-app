import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import type { ExamResult } from '@/types';

export function useExamResult() {
    const params = useLocalSearchParams<{ result?: string }>();
    const [result, setResult] = useState<ExamResult | null>(null);

    useEffect(() => {
        if (typeof params.result !== 'string') {
            setResult(null);
            return;
        }

        try {
            const parsed = JSON.parse(params.result) as ExamResult;
            setResult(parsed);
        } catch {
            setResult(null);
        }
    }, [params.result]);

    return { result };
}
