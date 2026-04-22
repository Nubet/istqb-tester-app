import { useQuery } from '@tanstack/react-query';
import { glossaryService } from '@/services';
import type { GlossaryTerm } from '@/types';
import { useState } from 'react';

export function useGlossary(enabled = true) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: terms = [], isLoading, error } = useQuery<GlossaryTerm[]>({
        queryKey: ['glossary', searchQuery],
        queryFn: () => glossaryService.searchTerms(searchQuery),
        enabled,
    });

    return {
        terms,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
    };
}
