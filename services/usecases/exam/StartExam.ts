import { ExamSession } from '@/services/entities';
import type { IQuestionRepository, IExamSessionRepository } from '@/repositories/contracts';
import { DEFAULT_EXAM_CONFIG } from '@/types';

type ChapterPool = {
    key: string;
    aliases: string[];
    count: number;
};

const EXAM_CHAPTER_DISTRIBUTION: ChapterPool[] = [
    {
        key: 'chapter1',
        aliases: ['Podstawy testowania', 'Rozdział 1: Podstawy testowania'],
        count: 6,
    },
    {
        key: 'chapter2',
        aliases: ['Testowanie w cyklu życia oprogramowania', 'Rozdział 2: Testowanie w cyklu życia oprogramowania'],
        count: 6,
    },
    {
        key: 'chapter3',
        aliases: ['Testowanie statyczne', 'Rozdział 3: Testowanie statyczne'],
        count: 3,
    },
    {
        key: 'chapter4',
        aliases: ['Analiza i projektowanie testów', 'Techniki testowania', 'Rozdział 4: Techniki testowania'],
        count: 12,
    },
    {
        key: 'chapter5',
        aliases: ['Zarządzanie testowaniem', 'Zarządzanie testami', 'Rozdział 5: Zarządzanie testami'],
        count: 8,
    },
    {
        key: 'chapter6',
        aliases: ['Narzędzia wspierające testowanie', 'Narzędzia wspomagające testowanie', 'Rozdział 6: Narzędzia wspomagające testowanie'],
        count: 5,
    },
];

function normalizeCategory(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}

function pickRandomItems<T>(items: T[], count: number): T[] {
    if (count <= 0) return [];

    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, Math.min(count, shuffled.length));
}

export class StartExamUseCase {
    constructor(
        private questionRepository: IQuestionRepository,
        private examSessionRepository: IExamSessionRepository
    ) {}

    async execute(): Promise<ExamSession> {
        const categories = await this.questionRepository.getCategories();
        const selectedByChapter: string[] = [];
        const selectedQuestionIds = new Set<string>();

        for (const chapter of EXAM_CHAPTER_DISTRIBUTION) {
            const matchedCategory = categories.find((category) => {
                const normalized = normalizeCategory(category);
                return chapter.aliases.some((alias) => normalizeCategory(alias) === normalized);
            });

            if (!matchedCategory) {
                continue;
            }

            const chapterQuestions = await this.questionRepository.getByCategory(matchedCategory);
            const chapterSelection = pickRandomItems(chapterQuestions, chapter.count);

            for (const question of chapterSelection) {
                if (selectedQuestionIds.has(question.id)) {
                    continue;
                }
                selectedQuestionIds.add(question.id);
                selectedByChapter.push(question.id);
            }
        }

        if (selectedByChapter.length < DEFAULT_EXAM_CONFIG.totalQuestions) {
            const allQuestions = await this.questionRepository.getAll();
            const unselected = allQuestions.filter((question) => !selectedQuestionIds.has(question.id));
            const missingCount = DEFAULT_EXAM_CONFIG.totalQuestions - selectedByChapter.length;
            const fallback = pickRandomItems(unselected, missingCount);
            for (const question of fallback) {
                selectedByChapter.push(question.id);
            }
        }

        const finalQuestionIds = selectedByChapter.slice(0, DEFAULT_EXAM_CONFIG.totalQuestions);

        const session = new ExamSession(
            this.generateSessionId(),
            new Date(),
            finalQuestionIds,
            DEFAULT_EXAM_CONFIG.timeLimitMinutes * 60
        );

        await this.examSessionRepository.save(session);
        return session;
    }

    private generateSessionId(): string {
        return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
