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
}
