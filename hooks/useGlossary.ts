import { useQuery } from '@tanstack/react-query';
import { glossaryService } from '@/services';
import type { GlossaryTerm } from '@/types';
import { useState } from 'react';

export function useGlossary() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: terms = [], isLoading, error } = useQuery<GlossaryTerm[]>({
        queryKey: ['glossary', searchQuery],
        queryFn: () => glossaryService.searchTerms(searchQuery),
    });

    return {
        terms,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
    };
}
