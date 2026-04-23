import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    DEFAULT_FLASHCARD_PREFERENCES,
    type FlashcardPreferences,
    type FlashcardFrontMode,
    type FlashcardOrderMode,
} from '@/constants/flashcards';
import { FLASHCARD_PREFERENCES_QUERY_KEY } from '@/constants/queryKeys';
import { storage } from '@/infra/storage';

const STORAGE_KEY = '@istqb_flashcard_preferences';

function isOrderMode(value: string): value is FlashcardOrderMode {
    return value === 'default' || value === 'shuffle';
}

function isFrontMode(value: string): value is FlashcardFrontMode {
    return value === 'term' || value === 'definition' || value === 'both';
}

function sanitizePreferences(input: unknown): FlashcardPreferences {
    if (!input || typeof input !== 'object') {
        return DEFAULT_FLASHCARD_PREFERENCES;
    }

    const raw = input as Partial<FlashcardPreferences>;
    return {
        orderMode: raw.orderMode && isOrderMode(raw.orderMode)
            ? raw.orderMode
            : DEFAULT_FLASHCARD_PREFERENCES.orderMode,
        frontMode: raw.frontMode && isFrontMode(raw.frontMode)
            ? raw.frontMode
            : DEFAULT_FLASHCARD_PREFERENCES.frontMode,
    };
}

async function getStoredFlashcardPreferences(): Promise<FlashcardPreferences> {
    const rawValue = await storage.getItem(STORAGE_KEY);

    if (!rawValue) {
        return DEFAULT_FLASHCARD_PREFERENCES;
    }

    try {
        const parsed = JSON.parse(rawValue);
        return sanitizePreferences(parsed);
    } catch {
        return DEFAULT_FLASHCARD_PREFERENCES;
    }
}

export function useFlashcardPreferences() {
    const queryClient = useQueryClient();

    const { data: preferences = DEFAULT_FLASHCARD_PREFERENCES, isPending } = useQuery({
        queryKey: FLASHCARD_PREFERENCES_QUERY_KEY,
        queryFn: getStoredFlashcardPreferences,
        initialData: DEFAULT_FLASHCARD_PREFERENCES,
        staleTime: Infinity,
    });

    const savePreferences = useMutation({
        mutationFn: async (nextPreferences: FlashcardPreferences) => {
            await storage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
            return nextPreferences;
        },
        onSuccess: (nextPreferences) => {
            queryClient.setQueryData(FLASHCARD_PREFERENCES_QUERY_KEY, nextPreferences);
        },
    });

    const setOrderMode = (orderMode: FlashcardOrderMode) => {
        if (orderMode === preferences.orderMode || savePreferences.isPending) {
            return;
        }

        savePreferences.mutate({ ...preferences, orderMode });
    };

    const setFrontMode = (frontMode: FlashcardFrontMode) => {
        if (frontMode === preferences.frontMode || savePreferences.isPending) {
            return;
        }

        savePreferences.mutate({ ...preferences, frontMode });
    };

    return {
        preferences,
        isLoadingPreferences: isPending,
        isSavingPreferences: savePreferences.isPending,
        setOrderMode,
        setFrontMode,
    };
}
