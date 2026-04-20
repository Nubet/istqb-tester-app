import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { ExamResult } from '@/types';

export function useExamResult() {
    const params = useLocalSearchParams<{ result?: string }>();
    const queryClient = useQueryClient();
    const [result, setResult] = useState<ExamResult | null>(null);

    useEffect(() => {
        if (typeof params.result !== 'string') {
            const cachedResult = queryClient.getQueryData<ExamResult>(['latestExamResult']);
            setResult(cachedResult ?? null);
            return;
        }

        try {
            const parsed = JSON.parse(params.result) as ExamResult;
            setResult(parsed);
            queryClient.setQueryData(['latestExamResult'], parsed);
        } catch {
            const cachedResult = queryClient.getQueryData<ExamResult>(['latestExamResult']);
            setResult(cachedResult ?? null);
        }
    }, [params.result, queryClient]);

    return { result };
}
