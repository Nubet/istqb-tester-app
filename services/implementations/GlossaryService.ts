import { glossaryRepository, userProgressRepository } from '@/repositories';
import { GlossaryCategorySummary, GlossaryTerm, FlashcardDeckSummary } from '@/types';
import { compareCategoryLabels } from '../utils/categorySort';

export class GlossaryService {
    async getAllTerms(): Promise<GlossaryTerm[]> {
        return await glossaryRepository.getAll();
    }

    async searchTerms(query: string): Promise<GlossaryTerm[]> {
        return await glossaryRepository.search(query);
    }

    async getCategories(): Promise<string[]> {
        const categories = await glossaryRepository.getCategories();
        return [...categories].sort(compareCategoryLabels);
    }

    async getTermsByCategory(category: string): Promise<GlossaryTerm[]> {
        return await glossaryRepository.getByCategory(category);
    }

    async getCategorySummaries(): Promise<GlossaryCategorySummary[]> {
        const summaries = await glossaryRepository.getCategorySummaries();
        return [...summaries].sort((a, b) => compareCategoryLabels(a.category, b.category));
    }

    async getDeckSummaries(): Promise<FlashcardDeckSummary[]> {
        const terms = await glossaryRepository.getAll();
        const progress = await userProgressRepository.get();

        const allDeck: FlashcardDeckSummary = {
            id: '__all__',
            title: 'Wszystkie pojęcia',
            totalCards: terms.length,
            masteredCards: 0,
            learningCards: 0,
            progressPercentage: 0,
        };

        const grouped = new Map<string, FlashcardDeckSummary>();

        terms.forEach(term => {
            const category = term.category || 'Inne';
            const state = progress.getFlashcardResult(term.id);

            if (state === 'known') allDeck.masteredCards++;
            if (state === 'learning') allDeck.learningCards++;

            let deck = grouped.get(category);
            if (!deck) {
                deck = {
                    id: category,
                    title: category,
                    totalCards: 0,
                    masteredCards: 0,
                    learningCards: 0,
                    progressPercentage: 0,
                };
                grouped.set(category, deck);
            }

            deck.totalCards++;
            if (state === 'known') deck.masteredCards++;
            if (state === 'learning') deck.learningCards++;
        });

        allDeck.progressPercentage = allDeck.totalCards > 0 ? Math.round((allDeck.masteredCards / allDeck.totalCards) * 100) : 0;

        const categoryDecks = Array.from(grouped.values()).map(deck => ({
            ...deck,
            progressPercentage: deck.totalCards > 0 ? Math.round((deck.masteredCards / deck.totalCards) * 100) : 0,
        })).sort((a, b) => compareCategoryLabels(a.title, b.title));

        return [allDeck, ...categoryDecks];
    }
}
