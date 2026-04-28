export const USER_PROGRESS_QUERY_KEY = ['userProgress'] as const;
export const USER_PROGRESS_SUMMARY_QUERY_KEY = ['userProgressSummary'] as const;
export const FLASHCARD_PREFERENCES_QUERY_KEY = ['flashcardPreferences'] as const;
export const FLASHCARD_DECKS_QUERY_KEY = ['glossaryFlashcardDecks'] as const;
export const flashcardDeckTermsQueryKey = (deckId: string) => ['flashcardDeckTerms', deckId] as const;
