import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GlossaryTerm } from '@/types';
import type { FlashcardOrderMode } from '@/constants/flashcards';

type UseFlashcardsSessionParams = {
    cards: GlossaryTerm[];
    orderMode: FlashcardOrderMode;
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
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [learningIds, setLearningIds] = useState<Set<string>>(new Set());
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [round, setRound] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);

const resetSession = useCallback(() => {
    const ids = orderedCards.map((card) => card.id);
    setQueue(ids);
    setRetryQueue([]);
    setKnownIds(new Set());
    setLearningIds(new Set());
    setCurrentId(ids[0] ?? null);
    setRound(1);
    setIsFlipped(false);
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

        setKnownIds((previous) => {
            const next = new Set(previous);
            next.add(currentId);
            return next;
        });

        setIsFlipped(false);
        advance(restQueue, nextRetryQueue);
    }, [advance, currentId, queue, retryQueue]);

const markLearning = useCallback(() => {
    if (!currentId) return;

    const [, ...restQueue] = queue;
    const nextRetryQueue = [...retryQueue, currentId];

    setLearningIds((previous) => {
      const next = new Set(previous);
      next.add(currentId);
      return next;
    });

    setIsFlipped(false);
    advance(restQueue, nextRetryQueue);
  }, [advance, currentId, queue, retryQueue]);

const currentCard = currentId ? cardsById.get(currentId) ?? null : null;
  const totalCards = orderedCards.length;
  const knownCount = knownIds.size;
  const learningCount = learningIds.size;
    const isComplete = currentId === null && totalCards > 0;
    const currentCardPosition = currentId
        ? Math.max(1, orderedCards.findIndex((card) => card.id === currentId) + 1)
        : totalCards;

    const toggleFlip = () => {
        if (!currentCard) return;
        setIsFlipped((value) => !value);
    };

    return {
        round,
        totalCards,
        currentCard,
        currentCardPosition,
        knownCount,
        learningCount,
        isComplete,
        isFlipped,
        setIsFlipped,
        toggleFlip,
        markKnown,
        markLearning,
        resetSession,
    };
}
