import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { progressService } from '@/services';
import { FLASHCARD_DECKS_QUERY_KEY } from '@/constants/queryKeys';
import type { GlossaryTerm } from '@/types';
import type { FlashcardOrderMode } from '@/constants/flashcards';

type UseFlashcardsSessionParams = {
    cards: GlossaryTerm[];
    orderMode: FlashcardOrderMode;
};

type FlashcardKnowledgeState = 'known' | 'learning' | 'unseen';

type FlashcardSessionStats = {
    totalCards: number;
    knownCount: number;
    learningCount: number;
    unseenCount: number;
    masteryRate: number;
};

function shuffleArray<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function useFlashcardsSession({ cards, orderMode }: UseFlashcardsSessionParams) {
    const queryClient = useQueryClient();

    const orderedCards = useMemo(() => {
        if (orderMode === 'shuffle') {
            return shuffleArray(cards);
        }

        return cards;
    }, [cards, orderMode]);

    const cardsById = useMemo(
        () => new Map(orderedCards.map((card) => [card.id, card])),
        [orderedCards]
    );

    const [sessionCardIds, setSessionCardIds] = useState<string[]>([]);
    const [queue, setQueue] = useState<string[]>([]);
    const [retryQueue, setRetryQueue] = useState<string[]>([]);
    const [cardKnowledgeById, setCardKnowledgeById] = useState<Record<string, FlashcardKnowledgeState>>({});
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [round, setRound] = useState(1);

    const startSession = useCallback((cardIds: string[], nextRound = 1) => {
        setSessionCardIds(cardIds);
        setQueue(cardIds);
        setRetryQueue([]);
        setCardKnowledgeById({});
        setCurrentId(cardIds[0] ?? null);
        setRound(nextRound);
    }, []);

    const resetSession = useCallback(() => {
        const ids = orderedCards.map((card) => card.id);
        startSession(ids, 1);
    }, [orderedCards, startSession]);

    useEffect(() => {
        resetSession();
    }, [resetSession]);

    const advance = useCallback((nextQueue: string[], nextRetryQueue: string[]) => {
        if (nextQueue.length > 0) {
            setQueue(nextQueue);
            setRetryQueue(nextRetryQueue);
            setCurrentId(nextQueue[0]);
            return;
        }

        setQueue([]);
        setRetryQueue([]);
        setCurrentId(null);
    }, []);

    const markKnown = useCallback(() => {
        if (!currentId) return;

        const [, ...restQueue] = queue;
        const nextRetryQueue = [...retryQueue];

        setCardKnowledgeById((previous) => ({
            ...previous,
            [currentId]: 'known',
        }));
        
        void progressService.recordFlashcardResult(currentId, 'known').then(() => {
             queryClient.invalidateQueries({ queryKey: FLASHCARD_DECKS_QUERY_KEY });
        });

        advance(restQueue, nextRetryQueue);
    }, [advance, currentId, queue, retryQueue, queryClient]);

    const markLearning = useCallback(() => {
        if (!currentId) return;

        const [, ...restQueue] = queue;
        const nextRetryQueue = [...retryQueue, currentId];

        setCardKnowledgeById((previous) => ({
            ...previous,
            [currentId]: 'learning',
        }));

        void progressService.recordFlashcardResult(currentId, 'learning').then(() => {
             queryClient.invalidateQueries({ queryKey: FLASHCARD_DECKS_QUERY_KEY });
        });

        advance(restQueue, nextRetryQueue);
    }, [advance, currentId, queue, retryQueue, queryClient]);

    const continueWithLearning = useCallback(() => {
        const learningCardIds = sessionCardIds.filter((cardId) => cardKnowledgeById[cardId] === 'learning');

        if (learningCardIds.length === 0) {
            return false;
        }

        startSession(learningCardIds, round + 1);
        return true;
    }, [cardKnowledgeById, round, sessionCardIds, startSession]);

    const currentCard = currentId ? cardsById.get(currentId) ?? null : null;
    const totalCards = sessionCardIds.length;
    const knownCount = useMemo(
        () => Object.values(cardKnowledgeById).filter((state) => state === 'known').length,
        [cardKnowledgeById]
    );
    const learningCount = useMemo(
        () => Object.values(cardKnowledgeById).filter((state) => state === 'learning').length,
        [cardKnowledgeById]
    );
    const unseenCount = Math.max(0, totalCards - knownCount - learningCount);
    const masteryRate = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;
    const stats: FlashcardSessionStats = {
        totalCards,
        knownCount,
        learningCount,
        unseenCount,
        masteryRate,
    };

    const isComplete = currentId === null && totalCards > 0;

    const indexByCardId = useMemo(() => {
        return new Map(sessionCardIds.map((cardId, index) => [cardId, index + 1]));
    }, [sessionCardIds]);

    const currentCardPosition = currentId
        ? indexByCardId.get(currentId) ?? 1
        : totalCards;

    return {
        round,
        totalCards,
        stats,
        currentCard,
        currentCardPosition,
        knownCount,
        learningCount,
        isComplete,
        markKnown,
        markLearning,
        continueWithLearning,
        resetSession,
    };
}
