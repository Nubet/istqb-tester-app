import { readFileSync, writeFileSync } from 'fs';

const raw = JSON.parse(readFileSync('questions.json', 'utf8'));

const CHAPTER_LABELS: Record<string, string> = {
    "1": "Podstawy testowania",
    "2": "Testowanie w cyklu życia oprogramowania",
    "3": "Testowanie statyczne",
    "4": "Analiza i projektowanie testów",
    "5": "Zarządzanie testowaniem",
    "6": "Narzędzia wspierające testowanie",
};

const ANSWER_RE = /^Answer_([a-dA-D])$/;
const OPTION_PREFIX_RE = /^\s*([A-D])[\.\)]\s*/;

function cleanNull(v: any): string {
    if (v === null || v === undefined) return "";
    if (typeof v === 'string') {
        const s = v.trim();
        if (s.toLowerCase() === 'null') return "";
        return s;
    }
    return String(v);
}

function normalizeOption(text: string, letter: string) {
    let t = text.trim();
    const m = t.match(OPTION_PREFIX_RE);
    if (m && m[1] === letter) {
        t = t.replace(OPTION_PREFIX_RE, '').trim();
    }
    return t;
}

const normalized = raw.items.map((item: any) => {
    const cols = item.columns;
    const id = `q${String(item.index).padStart(4, '0')}`;
    const text = cleanNull(cols[1]);
    const a = cleanNull(cols[2]);
    const b = cleanNull(cols[3]);
    const c = cleanNull(cols[4]);
    const d = cleanNull(cols[5]);

    const correctRaw = cleanNull(cols[6]);
    const correctMatch = correctRaw.match(ANSWER_RE);
    const correctAnswer = correctMatch ? correctMatch[1].toUpperCase() : 'A';

    const explanation = cleanNull(cols[8]);
    const chapter = cleanNull(cols[10]) || "1";
    const category = CHAPTER_LABELS[chapter] || `Rozdział ${chapter}`;

    return {
        id,
        text,
        options: {
            A: normalizeOption(a, 'A'),
            B: normalizeOption(b, 'B'),
            C: normalizeOption(c, 'C'),
            D: normalizeOption(d, 'D'),
        },
        correctAnswer,
        explanation,
        category,
        difficulty: 'medium' // placeholder
    };
});

writeFileSync('data/questions.normalized.json', JSON.stringify({ items: normalized }, null, 2));
console.log('Normalized', normalized.length, 'questions');
