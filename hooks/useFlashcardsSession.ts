import { useCallback, useEffect, useMemo, useState } from 'react';
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

    const [queue, setQueue] = useState<string[]>([]);
    const [retryQueue, setRetryQueue] = useState<string[]>([]);
    const [cardKnowledgeById, setCardKnowledgeById] = useState<Record<string, FlashcardKnowledgeState>>({});
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [round, setRound] = useState(1);

    const resetSession = useCallback(() => {
        const ids = orderedCards.map((card) => card.id);
        setQueue(ids);
        setRetryQueue([]);
        setCardKnowledgeById({});
        setCurrentId(ids[0] ?? null);
        setRound(1);
    }, [orderedCards]);

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

        if (nextRetryQueue.length > 0) {
            setQueue(nextRetryQueue);
            setRetryQueue([]);
            setCurrentId(nextRetryQueue[0]);
            setRound((currentRound) => currentRound + 1);
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

        advance(restQueue, nextRetryQueue);
    }, [advance, currentId, queue, retryQueue]);

    const markLearning = useCallback(() => {
        if (!currentId) return;

        const [, ...restQueue] = queue;
        const nextRetryQueue = [...retryQueue, currentId];

        setCardKnowledgeById((previous) => ({
            ...previous,
            [currentId]: 'learning',
        }));

        advance(restQueue, nextRetryQueue);
    }, [advance, currentId, queue, retryQueue]);

    const currentCard = currentId ? cardsById.get(currentId) ?? null : null;
    const totalCards = orderedCards.length;
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
        return new Map(orderedCards.map((card, index) => [card.id, index + 1]));
    }, [orderedCards]);

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
        resetSession,
    };
}
