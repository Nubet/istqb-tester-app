import type { LearningSession, Question } from '@/types';
import { questionRepository } from '@/repositories';
import { StartLearningSessionUseCase } from './usecases/learning/StartLearningSession';
import { compareCategoryLabels } from './utils/categorySort';

const startLearningSessionUseCase = new StartLearningSessionUseCase(questionRepository);

type SectionDefinition = {
    order: number;
    label: string;
    aliases: string[];
};

const SECTION_DEFINITIONS: SectionDefinition[] = [
    {
        order: 1,
        label: 'Rozdział 1: Podstawy testowania',
        aliases: ['Rozdział 1: Podstawy testowania', 'Podstawy testowania'],
    },
    {
        order: 2,
        label: 'Rozdział 2: Testowanie w cyklu życia oprogramowania',
        aliases: ['Rozdział 2: Testowanie w cyklu życia oprogramowania', 'Testowanie w cyklu życia oprogramowania'],
    },
    {
        order: 3,
        label: 'Rozdział 3: Testowanie statyczne',
        aliases: ['Rozdział 3: Testowanie statyczne', 'Testowanie statyczne'],
    },
    {
        order: 4,
        label: 'Rozdział 4: Techniki testowania',
        aliases: ['Rozdział 4: Techniki testowania', 'Techniki testowania', 'Analiza i projektowanie testów'],
    },
    {
        order: 5,
        label: 'Rozdział 5: Zarządzanie testami',
        aliases: ['Rozdział 5: Zarządzanie testami', 'Zarządzanie testami', 'Zarządzanie testowaniem'],
    },
    {
        order: 6,
        label: 'Rozdział 6: Narzędzia wspomagające testowanie',
        aliases: ['Rozdział 6: Narzędzia wspomagające testowanie', 'Narzędzia wspomagające testowanie', 'Narzędzia wspierające testowanie'],
    },
];

function normalizeCategory(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\.$/, '');
}

function findSectionDefinition(category: string): SectionDefinition | undefined {
    const normalizedCategory = normalizeCategory(category);
    return SECTION_DEFINITIONS.find((definition) =>
        definition.aliases.some((alias) => normalizeCategory(alias) === normalizedCategory)
    );
}

export class LearningService {
    async getSections(): Promise<string[]> {
        const categories = await questionRepository.getCategories();
        const mappedSections = categories.map((category) => {
            const definition = findSectionDefinition(category);
            return {
                label: definition?.label ?? category,
                order: definition?.order ?? Number.MAX_SAFE_INTEGER,
            };
        });

        const uniqueLabels = Array.from(new Set(mappedSections.map((section) => section.label)));

        return uniqueLabels.sort((a, b) => {
            const sectionA = mappedSections.find((section) => section.label === a);
            const sectionB = mappedSections.find((section) => section.label === b);
            const orderA = sectionA?.order ?? Number.MAX_SAFE_INTEGER;
            const orderB = sectionB?.order ?? Number.MAX_SAFE_INTEGER;

            if (orderA !== orderB) {
                return orderA - orderB;
            }

            return compareCategoryLabels(a, b);
        });
    }

    async startSession(category: string): Promise<LearningSession> {
        const availableCategories = await questionRepository.getCategories();
        const directMatch = availableCategories.find(
            (availableCategory) => normalizeCategory(availableCategory) === normalizeCategory(category)
        );

        if (directMatch) {
            return startLearningSessionUseCase.execute(directMatch);
        }

        const definition = findSectionDefinition(category);
        const fallbackMatch = definition
            ? availableCategories.find((availableCategory) =>
                definition.aliases.some((alias) => normalizeCategory(alias) === normalizeCategory(availableCategory))
            )
            : undefined;

        return startLearningSessionUseCase.execute(fallbackMatch ?? category);
    }

    async getSessionQuestions(questionIds: string[]): Promise<Question[]> {
        return questionRepository.getByIds(questionIds);
    }
}
