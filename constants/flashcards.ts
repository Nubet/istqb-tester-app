export type FlashcardOrderMode = 'default' | 'shuffle';
export type FlashcardFrontMode = 'term' | 'definition' | 'both';

export type FlashcardPreferences = {
    orderMode: FlashcardOrderMode;
    frontMode: FlashcardFrontMode;
};

export const DEFAULT_FLASHCARD_PREFERENCES: FlashcardPreferences = {
    orderMode: 'default',
    frontMode: 'term',
};

export const FLASHCARD_ORDER_OPTIONS: { mode: FlashcardOrderMode; label: string }[] = [
    { mode: 'default', label: 'Standardowa' },
    { mode: 'shuffle', label: 'Pomieszana' },
];

export const FLASHCARD_FRONT_OPTIONS: { mode: FlashcardFrontMode; label: string }[] = [
    { mode: 'term', label: 'Najpierw pojęcie' },
    { mode: 'definition', label: 'Najpierw definicja' },
    { mode: 'both', label: 'Pojęcie i definicja' },
];
