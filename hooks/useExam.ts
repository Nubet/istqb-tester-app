import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { examService, bookmarkService } from '../services';
import type { AnswerId } from '../types';

export function useExam() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { data: session, refetch: refetchSession } = useQuery({
        queryKey: ['examSession'],
        queryFn: () => examService.getCurrentSession(),
    });

    const { data: questions } = useQuery({
        queryKey: ['examQuestions', session?.questions],
        queryFn: async () => {
            if (!session) return [];
            return examService.getSessionQuestions(session.questions);
        },
        enabled: !!session,
    });

    const startExam = useMutation({
        mutationFn: () => examService.startExam(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSession'] });
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
        },
    });

    const toggleBookmarkMutation = useMutation({
        mutationFn: ({ questionId, source }: { questionId: string; source: 'exam' | 'learning' }) =>
            bookmarkService.toggleBookmark(questionId, source),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProgress'] });
        },
    });

    const answerQuestion = useCallback(async (answer: AnswerId) => {
        if (!session || !questions) return;

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        setSelectedAnswer(answer);

        await examService.answerQuestion(session.id, currentQuestion.id, answer);
        await refetchSession();
    }, [session, questions, currentQuestionIndex, refetchSession]);

    const toggleBookmark = useCallback(() => {
        if (!questions || !session) return;
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        toggleBookmarkMutation.mutate({
            questionId: currentQuestion.id,
            source: 'exam',
        });
        setIsBookmarked(!isBookmarked);
    }, [questions, currentQuestionIndex, isBookmarked, session, toggleBookmarkMutation]);

    const finishExam = useCallback(async () => {
        if (!session) return;

        const result = await examService.completeExam(session.id);
        await queryClient.invalidateQueries({ queryKey: ['examSession'] });
        await queryClient.invalidateQueries({ queryKey: ['userProgress'] });

        router.push({
            pathname: '/results',
            params: { result: JSON.stringify(result) },
        });
    }, [session, queryClient, router]);

    useEffect(() => {
        if (!session && !startExam.isPending) {
            startExam.mutate();
        }
    }, [session, startExam]);

    useEffect(() => {
        if (session && !session.isCompleted) {
            timerRef.current = setInterval(() => {
                examService.tickSession(session);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [session]);

    const currentQuestion = questions?.[currentQuestionIndex];

    return {
        currentQuestion,
        currentIndex: currentQuestionIndex,
        totalQuestions: questions?.length || 0,
        timeRemaining: session?.timeRemainingSeconds || 0,
        selectedAnswer,
        isBookmarked,
        answerQuestion,
        toggleBookmark,
        finishExam,
        isLoading: startExam.isPending,
    };
}
