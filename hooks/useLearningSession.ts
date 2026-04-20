import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { learningService } from '@/services';
import type { Question, AnswerId, LearningSession } from '@/types';

type LearningAnswerState = {
    selectedAnswer: AnswerId;
    isCorrect: boolean;
};

export function useLearningSession() {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [session, setSession] = useState<LearningSession | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [answerFeedbackVersion, setAnswerFeedbackVersion] = useState(0);
    const [answersByQuestionId, setAnswersByQuestionId] = useState<Record<string, LearningAnswerState>>({});

    const { data: sections = [], isPending: isSectionsPending } = useQuery({
        queryKey: ['learningSections'],
        queryFn: () => learningService.getSections(),
    });

    const startSession = useMutation({
        mutationFn: (category: string) => learningService.startSession(category),
        onSuccess: (newSession) => {
            setSession(newSession);
            setAnswersByQuestionId({});
            setSelectedAnswer(null);
            setHasAnswered(false);
            setIsCorrect(false);
        },
    });

    const { data: questions } = useQuery({
        queryKey: ['learningQuestions', selectedSection, session?.questionIds],
        queryFn: async () => {
            if (!session) return [];
            return learningService.getSessionQuestions(session.questionIds);
        },
        enabled: !!session,
    });

    const startSection = useCallback((section: string) => {
        setSelectedSection(section);
        setAnswersByQuestionId({});
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
        startSession.mutate(section);
    }, [startSession]);

    const backToSections = useCallback(() => {
        setSession(null);
        setSelectedSection(null);
        setAnswersByQuestionId({});
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
    }, []);

    const currentQuestion = questions?.find(
        (q: Question) => q.id === session?.questionIds[session.currentIndex]
    );

    const answerQuestion = useCallback((answer: AnswerId) => {
        if (!currentQuestion) return;

        const questionId = currentQuestion.id;
        const result = answer === currentQuestion.correctAnswer;

        setAnswersByQuestionId((prev) => ({
            ...prev,
            [questionId]: {
                selectedAnswer: answer,
                isCorrect: result,
            },
        }));
        setSelectedAnswer(answer);
        setHasAnswered(true);
        setIsCorrect(result);
        setAnswerFeedbackVersion((prev) => prev + 1);
    }, [currentQuestion]);

    const syncAnswerStateForIndex = useCallback((index: number, targetSession: LearningSession) => {
        const questionId = targetSession.questionIds[index];
        const existing = answersByQuestionId[questionId];

        if (existing) {
            setSelectedAnswer(existing.selectedAnswer);
            setHasAnswered(true);
            setIsCorrect(existing.isCorrect);
            return;
        }

        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
    }, [answersByQuestionId]);

    const nextQuestion = useCallback(() => {
        if (!session) return;

        if (session.currentIndex < session.questionIds.length - 1) {
            const updatedSession = {
                ...session,
                currentIndex: session.currentIndex + 1,
            };
            setSession(updatedSession);
            syncAnswerStateForIndex(updatedSession.currentIndex, updatedSession);
        }
    }, [session, syncAnswerStateForIndex]);

    const previousQuestion = useCallback(() => {
        if (!session || session.currentIndex === 0) return;

        const updatedSession = {
            ...session,
            currentIndex: session.currentIndex - 1,
        };
        setSession(updatedSession);
        syncAnswerStateForIndex(updatedSession.currentIndex, updatedSession);
    }, [session, syncAnswerStateForIndex]);

    const goToQuestion = useCallback((index: number) => {
        if (!session) return;
        if (index < 0 || index >= session.questionIds.length) return;

        const updatedSession = {
            ...session,
            currentIndex: index,
        };
        setSession(updatedSession);
        syncAnswerStateForIndex(updatedSession.currentIndex, updatedSession);
    }, [session, syncAnswerStateForIndex]);

    return {
        sections,
        selectedSection,
        isSectionSelection: !session,
        questionIds: session?.questionIds || [],
        answersByQuestionId,
        currentQuestion,
        currentIndex: session?.currentIndex || 0,
        totalQuestions: session?.questionIds.length || 0,
        selectedAnswer,
        hasAnswered,
        isCorrect,
        answerFeedbackVersion,
        startSection,
        backToSections,
        answerQuestion,
        previousQuestion,
        goToQuestion,
        nextQuestion,
        isLoadingSections: isSectionsPending,
        isStartingSection: startSession.isPending,
    };
}
