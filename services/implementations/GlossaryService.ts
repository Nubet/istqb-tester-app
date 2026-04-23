import { glossaryRepository } from '@/repositories';
import { GlossaryTerm } from '@/types';
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

    async getCategorySummaries(): Promise<{ category: string; count: number }[]> {
        const summaries = await glossaryRepository.getCategorySummaries();
        return [...summaries].sort((a, b) => compareCategoryLabels(a.category, b.category));
    }
}
