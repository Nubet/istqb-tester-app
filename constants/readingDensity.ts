export type ReadingDensityMode = 'compact' | 'optimal' | 'large';

export interface ReadingDensityConfig {
    mode: ReadingDensityMode;
    label: string;
    description: string;
    textScale: number;
    spacingScale: number;
    answerTextScale: number;
    answerSpacingScale: number;
    optionMinHeight: number;
}

export const DEFAULT_READING_DENSITY_MODE: ReadingDensityMode = 'compact';

export const READING_DENSITY: Record<ReadingDensityMode, ReadingDensityConfig> = {
    compact: {
        mode: 'compact',
        label: 'Kompaktowy',
        description: '',
        textScale: 0.86,
        spacingScale: 0.82,
        answerTextScale: 0.8,
        answerSpacingScale: 0.74,
        optionMinHeight: 44,
    },
    optimal: {
        mode: 'optimal',
        label: 'Standard',
        description: '',
        textScale: 0.93,
        spacingScale: 0.92,
        answerTextScale: 0.9,
        answerSpacingScale: 0.86,
        optionMinHeight: 46,
    },
    large: {
        mode: 'large',
        label: 'Duży',
        description: '',
        textScale: 1,
        spacingScale: 1,
        answerTextScale: 1,
        answerSpacingScale: 1,
        optionMinHeight: 48,
    },
};

export const READING_DENSITY_OPTIONS: ReadingDensityConfig[] = [
    READING_DENSITY.compact,
    READING_DENSITY.optimal,
    READING_DENSITY.large,
];

export function scaleValue(value: number, scale: number, min = 0): number {
    return Math.max(min, Math.round(value * scale));
}
