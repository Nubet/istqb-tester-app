import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services';
import { USER_PROGRESS_SUMMARY_QUERY_KEY } from '@/constants/queryKeys';

export function useUserProgress() {
    const { data, isLoading } = useQuery({
        queryKey: USER_PROGRESS_SUMMARY_QUERY_KEY,
        queryFn: () => progressService.getSummary(),
    });

    return {
        progress: data?.progress,
        completionPercentage: data?.completionPercentage || 0,
        totalQuestions: data?.totalQuestions || 0,
        isLoading,
    };
}
