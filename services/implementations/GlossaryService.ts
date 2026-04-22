import { glossaryRepository } from '@/repositories';
import { GlossaryTerm } from '@/types';

export class GlossaryService {
    async getAllTerms(): Promise<GlossaryTerm[]> {
        return await glossaryRepository.getAll();
    }

    async searchTerms(query: string): Promise<GlossaryTerm[]> {
        return await glossaryRepository.search(query);
    }

    async getCategories(): Promise<string[]> {
        return await glossaryRepository.getCategories();
    }
}
