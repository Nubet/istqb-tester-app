import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { learningService } from '@/services';
import type { Question, AnswerId, LearningSession } from '@/types';

export function useLearningSession() {
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [session, setSession] = useState<LearningSession | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const { data: sections = [], isPending: isSectionsPending } = useQuery({
        queryKey: ['learningSections'],
        queryFn: () => learningService.getSections(),
    });

    const startSession = useMutation({
        mutationFn: (category: string) => learningService.startSession(category),
        onSuccess: (newSession) => {
            setSession(newSession);
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
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
        startSession.mutate(section);
    }, [startSession]);

    const backToSections = useCallback(() => {
        setSession(null);
        setSelectedSection(null);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
    }, []);

    const currentQuestion = questions?.find(
        (q: Question) => q.id === session?.questionIds[session.currentIndex]
    );

    const answerQuestion = useCallback((answer: AnswerId) => {
        if (!currentQuestion || hasAnswered) return;

        setSelectedAnswer(answer);
        setHasAnswered(true);
        setIsCorrect(answer === currentQuestion.correctAnswer);
    }, [currentQuestion, hasAnswered]);

    const nextQuestion = useCallback(() => {
        if (!session) return;

        if (session.currentIndex < session.questionIds.length - 1) {
            setSession({
                ...session,
                currentIndex: session.currentIndex + 1,
            });
            setSelectedAnswer(null);
            setHasAnswered(false);
            setIsCorrect(false);
        } else {
            backToSections();
        }
    }, [session, backToSections]);

    return {
        sections,
        selectedSection,
        isSectionSelection: !session,
        currentQuestion,
        currentIndex: session?.currentIndex || 0,
        totalQuestions: session?.questionIds.length || 10,
        selectedAnswer,
        hasAnswered,
        isCorrect,
        startSection,
        backToSections,
        answerQuestion,
        nextQuestion,
        isLoadingSections: isSectionsPending,
        isStartingSection: startSession.isPending,
    };
}
