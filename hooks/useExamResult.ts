import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { ExamResult } from '@/types';

export function useExamResult() {
    const params = useLocalSearchParams<{ result?: string }>();
    const queryClient = useQueryClient();

    const result = useMemo(() => {
        if (typeof params.result === 'string') {
            try {
                return JSON.parse(params.result) as ExamResult;
            } catch {
                return queryClient.getQueryData<ExamResult>(['latestExamResult']) ?? null;
            }
        }

        return queryClient.getQueryData<ExamResult>(['latestExamResult']) ?? null;
    }, [params.result, queryClient]);

    return { result };
}
