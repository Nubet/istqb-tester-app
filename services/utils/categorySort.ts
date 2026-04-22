function romanToInt(roman: string): number | null {
    const values: Record<string, number> = {
        I: 1,
        V: 5,
        X: 10,
        L: 50,
        C: 100,
        D: 500,
        M: 1000,
    };

    let total = 0;
    let previous = 0;

    for (let index = roman.length - 1; index >= 0; index -= 1) {
        const char = roman[index];
        const current = values[char];

        if (!current) {
            return null;
        }

        if (current < previous) {
            total -= current;
        } else {
            total += current;
            previous = current;
        }
    }

    return total;
}

function extractSectionNumber(label: string): number | null {
    const trimmed = label.trim();
    const chapterMatch = trimmed.match(/(?:^|\b)(?:rozdzia(?:ł|l)|chapter)\s*(\d+|[ivxlcdm]+)\b/i);
    const leadingMatch = trimmed.match(/^(\d+|[ivxlcdm]+)(?:[\s\-\.:\)])+/i);
    const exactMatch = trimmed.match(/^(\d+|[ivxlcdm]+)$/i);
    const rawToken = chapterMatch?.[1] ?? leadingMatch?.[1] ?? exactMatch?.[1];

    if (!rawToken) {
        return null;
    }

    if (/^\d+$/.test(rawToken)) {
        return Number.parseInt(rawToken, 10);
    }

    return romanToInt(rawToken.toUpperCase());
}

export function compareCategoryLabels(a: string, b: string): number {
    const numberA = extractSectionNumber(a);
    const numberB = extractSectionNumber(b);

    if (numberA !== null && numberB !== null && numberA !== numberB) {
        return numberA - numberB;
    }

    if (numberA !== null && numberB === null) {
        return -1;
    }

    if (numberA === null && numberB !== null) {
        return 1;
    }

    return a.localeCompare(b, 'pl', { sensitivity: 'base' });
}
