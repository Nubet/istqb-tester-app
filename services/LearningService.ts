import type { LearningSession, Question, LearningSectionSummary } from '@/types';
import { questionRepository, userProgressRepository } from '@/repositories';
import { StartLearningSessionUseCase } from './usecases/learning/StartLearningSession';
import { compareCategoryLabels } from './utils/categorySort';

const startLearningSessionUseCase = new StartLearningSessionUseCase(questionRepository, userProgressRepository);

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

function splitSectionLabel(section: string): { chapter: string; title: string } {
    const match = section.match(/^Rozdzia(?:ł|l)\s*(\d+)\s*:\s*(.+)$/i);

    if (!match) {
        return {
            chapter: 'Rozdział',
            title: section,
        };
    }

    return {
        chapter: `Rozdział ${match[1]}`,
        title: match[2].trim(),
    };
}

export class LearningService {
    async getSections(): Promise<LearningSectionSummary[]> {
        const categories = await questionRepository.getCategories();
        const progress = await userProgressRepository.get();
        const allQuestions = await questionRepository.getAll();

        const questionsByCategory = new Map<string, Question[]>();
        allQuestions.forEach((question) => {
            const list = questionsByCategory.get(question.category) ?? [];
            list.push(question);
            questionsByCategory.set(question.category, list);
        });

        const mappedSections = categories.map((category) => {
            const definition = findSectionDefinition(category);
            const label = definition?.label ?? category;
            const order = definition?.order ?? Number.MAX_SAFE_INTEGER;

            const categoryQuestions = questionsByCategory.get(category) ?? [];
            let mastered = 0;
            let wrong = 0;

            categoryQuestions.forEach(q => {
                const answerResult = progress.getLearningAnswerResult(q.id);
                if (answerResult === true) {
                    mastered++;
                } else if (answerResult === false) {
                    wrong++;
                }
            });
            
            const { chapter, title } = splitSectionLabel(label);

            return {
                id: label,
                label,
                categoryIds: [category],
                chapter,
                title,
                order,
                totalQuestions: categoryQuestions.length,
                masteredQuestions: mastered,
                wrongQuestions: wrong,
                progressPercentage: categoryQuestions.length > 0 ? Math.round((mastered / categoryQuestions.length) * 100) : 0,
            };
        });

        // Dedup by label and merge stats
        const grouped = new Map<string, LearningSectionSummary>();
        mappedSections.forEach(section => {
            const existing = grouped.get(section.label);
            if (existing) {
                existing.totalQuestions += section.totalQuestions;
                existing.masteredQuestions += section.masteredQuestions;
                existing.wrongQuestions += section.wrongQuestions;
                existing.categoryIds = [...existing.categoryIds, ...section.categoryIds];
                existing.progressPercentage = existing.totalQuestions > 0 ? Math.round((existing.masteredQuestions / existing.totalQuestions) * 100) : 0;
            } else {
                grouped.set(section.label, section);
            }
        });

        const uniqueSections = Array.from(grouped.values());

        return uniqueSections.sort((a, b) => {
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            return compareCategoryLabels(a.label, b.label);
        });
    }

    async startSession(category: string, mode: 'all' | 'wrong' = 'all'): Promise<LearningSession> {
        const availableCategories = await questionRepository.getCategories();
        const definition = findSectionDefinition(category);

        const matchedCategories = definition
            ? availableCategories.filter((availableCategory) =>
                definition.aliases.some((alias) => normalizeCategory(alias) === normalizeCategory(availableCategory))
            )
            : [];

        if (matchedCategories.length > 0) {
            return startLearningSessionUseCase.execute(matchedCategories, mode);
        }

        const directMatch = availableCategories.find(
            (availableCategory) => normalizeCategory(availableCategory) === normalizeCategory(category)
        );

        return startLearningSessionUseCase.execute(directMatch ?? category, mode);
    }

    async getSessionQuestions(questionIds: string[]): Promise<Question[]> {
        return questionRepository.getByIds(questionIds);
    }
}
