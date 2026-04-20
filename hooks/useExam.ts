import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { examService } from '@/services';
import { DEFAULT_EXAM_CONFIG, type AnswerId } from '@/types';

export function useExam() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(DEFAULT_EXAM_CONFIG.timeLimitMinutes * 60);
    const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, AnswerId | null>>({});
    const [flaggedQuestionIds, setFlaggedQuestionIds] = useState<string[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isFinishingRef = useRef(false);

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
            setAnswersByQuestionId({});
            setFlaggedQuestionIds([]);
        },
    });

    const answerQuestion = useCallback(async (answer: AnswerId) => {
        if (!session || !questions) return;

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        setAnswersByQuestionId((prev) => ({
            ...prev,
            [currentQuestion.id]: answer,
        }));

        await examService.answerQuestion(session.id, currentQuestion.id, answer);
        await refetchSession();
    }, [session, questions, currentQuestionIndex, refetchSession]);

    const toggleFlag = useCallback(() => {
        if (!questions) return;
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        setFlaggedQuestionIds((prev) => {
            if (prev.includes(currentQuestion.id)) {
                return prev.filter((id) => id !== currentQuestion.id);
            }

            return [...prev, currentQuestion.id];
        });
    }, [questions, currentQuestionIndex]);

    const finishExam = useCallback(async () => {
        if (!session || isFinishingRef.current) return;
        isFinishingRef.current = true;

        try {
            const result = await examService.completeExam(session.id);
            queryClient.setQueryData(['latestExamResult'], result);
            await queryClient.invalidateQueries({ queryKey: ['examSession'] });
            await queryClient.invalidateQueries({ queryKey: ['userProgress'] });

            router.replace('/results');
        } catch (error) {
            isFinishingRef.current = false;
            console.error('Failed to finish exam:', error);
        }
    }, [session, queryClient, router]);

    const goToQuestion = useCallback((index: number) => {
        if (!questions || index < 0 || index >= questions.length) return;
        setCurrentQuestionIndex(index);
    }, [questions]);

    const goToNextQuestion = useCallback(() => {
        if (!questions) return;
        setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    }, [questions]);

    const goToPreviousQuestion = useCallback(() => {
        setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    useEffect(() => {
        if (isFinishingRef.current) return;
        if ((!session || session.isCompleted) && !startExam.isPending) {
            startExam.mutate();
        }
    }, [session, startExam]);

    useEffect(() => {
        if (session) {
            setTimeRemaining(session.timeRemainingSeconds);

            const restoredAnswers: Record<string, AnswerId | null> = {};
            for (const [questionId, answer] of session.getAllAnswers().entries()) {
                restoredAnswers[questionId] = answer.selectedAnswer;
            }

            setAnswersByQuestionId((prev) => ({
                ...restoredAnswers,
                ...prev,
            }));
        }
    }, [session]);

    useEffect(() => {
        if (session && !session.isCompleted) {
            timerRef.current = setInterval(() => {
                setTimeRemaining((prev) => Math.max(0, prev - 1));
                examService.tickSession(session);
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [session]);

    useEffect(() => {
        if (!session || session.isCompleted) return;
        if (timeRemaining > 0) return;

        finishExam();
    }, [finishExam, session, timeRemaining]);

    useEffect(() => {
        if (!questions || questions.length === 0) return;
        if (currentQuestionIndex < questions.length) return;

        setCurrentQuestionIndex(questions.length - 1);
    }, [currentQuestionIndex, questions]);

    const currentQuestion = questions?.[currentQuestionIndex];
    const selectedAnswer = currentQuestion ? answersByQuestionId[currentQuestion.id] ?? null : null;
    const isFlagged = currentQuestion ? flaggedQuestionIds.includes(currentQuestion.id) : false;

    const questionIds = questions?.map((question) => question.id) ?? [];

    const answeredQuestionIds = questionIds.filter((questionId) => {
        const answer = answersByQuestionId[questionId];
        return answer !== null && answer !== undefined;
    });

    return {
        currentQuestion,
        currentIndex: currentQuestionIndex,
        questionIds,
        totalQuestions: questions?.length || 0,
        timeRemaining,
        selectedAnswer,
        answeredQuestionIds,
        flaggedQuestionIds,
        isFlagged,
        goToQuestion,
        goToNextQuestion,
        goToPreviousQuestion,
        answerQuestion,
        toggleFlag,
        finishExam,
        isLoading: startExam.isPending,
    };
}
