import { useQuery } from '@tanstack/react-query';
import { progressService } from '../services';

export function useUserProgress() {
    const { data, isLoading } = useQuery({
        queryKey: ['userProgress'],
        queryFn: () => progressService.getSummary(),
    });

    return {
        progress: data?.progress,
        completionPercentage: data?.completionPercentage || 0,
        totalQuestions: data?.totalQuestions || 0,
        isLoading,
    };
}
