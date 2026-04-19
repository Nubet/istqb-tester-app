import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Star, Funnel, ChevronLeft, ChevronRight, Lightbulb, CheckSquare, XSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useLearningSession } from '@/hooks/useLearningSession';
import { useBookmarks } from '@/hooks/useBookmarks';

type QuestionFilter = 'all' | 'unanswered' | 'wrong' | 'correct';

export default function LearnScreen() {
    const router = useRouter();
    const {
        sections,
        selectedSection,
        isSectionSelection,
        questionIds,
        answersByQuestionId,
        currentQuestion,
        currentIndex,
        totalQuestions,
        selectedAnswer,
        hasAnswered,
        isCorrect,
        answerFeedbackVersion,
        startSection,
        answerQuestion,
        goToQuestion,
        isLoadingSections,
        isStartingSection,
    } = useLearningSession();
    const { toggleBookmark, isBookmarked } = useBookmarks();

    const [showExplanation, setShowExplanation] = useState(false);
    const [showAnswerBanner, setShowAnswerBanner] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [questionFilter, setQuestionFilter] = useState<QuestionFilter>('all');

    const filteredQuestionIndexes = questionIds
        .map((questionId, index) => ({ questionId, index }))
        .filter(({ questionId }) => {
            const answerState = answersByQuestionId[questionId];

            if (questionFilter === 'all') return true;
            if (questionFilter === 'unanswered') return !answerState;
            if (questionFilter === 'wrong') return !!answerState && !answerState.isCorrect;
            return !!answerState && answerState.isCorrect;
        })
        .map(({ index }) => index);

    const currentFilteredPosition = filteredQuestionIndexes.indexOf(currentIndex);
    const canGoToPrevious = currentFilteredPosition > 0;
    const canGoToNext = currentFilteredPosition >= 0 && currentFilteredPosition < filteredQuestionIndexes.length - 1;
    const currentQuestionBookmarked = currentQuestion ? isBookmarked(currentQuestion.id) : false;
    const answerStatusText = isCorrect ? 'Odpowiedź poprawna' : 'Odpowiedź błędna';

    const goToPreviousVisibleQuestion = () => {
        if (!canGoToPrevious) return;
        goToQuestion(filteredQuestionIndexes[currentFilteredPosition - 1]);
    };

    const goToNextVisibleQuestion = () => {
        if (!canGoToNext) return;
        goToQuestion(filteredQuestionIndexes[currentFilteredPosition + 1]);
    };

    const selectFilter = (filter: QuestionFilter) => {
        setQuestionFilter(filter);
        setIsFilterOpen(false);
    };

    const getFilterLabel = (filter: QuestionFilter) => {
        if (filter === 'all') return 'Wszystkie';
        if (filter === 'unanswered') return 'Bez odpowiedzi';
        if (filter === 'wrong') return 'Bledne odpowiedzi';
        return 'Poprawne odpowiedzi';
    };

    useEffect(() => {
        setShowExplanation(false);
    }, [currentIndex, selectedSection]);

    useEffect(() => {
        if (!hasAnswered) {
            setShowAnswerBanner(false);
            return;
        }

        setShowAnswerBanner(true);
        const timeoutId = setTimeout(() => {
            setShowAnswerBanner(false);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [answerFeedbackVersion, hasAnswered]);

    useEffect(() => {
        if (!filteredQuestionIndexes.includes(currentIndex) && filteredQuestionIndexes.length > 0) {
            goToQuestion(filteredQuestionIndexes[0]);
        }
    }, [currentIndex, filteredQuestionIndexes, goToQuestion]);

    if (isSectionSelection) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header} edges={['top']}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={20} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tryb nauki</Text>
                    <View style={styles.placeholder} />
                </SafeAreaView>

                <View style={styles.content}>
                    <Text style={styles.sectionIntro}>Wybierz sekcję, z której chcesz ćwiczyć pytania.</Text>

                    {isLoadingSections ? (
                        <View style={styles.center}>
                            <Text style={styles.loading}>Ładowanie sekcji...</Text>
                        </View>
                    ) : (
                        <View style={styles.options}>
                            {sections.map((section) => (
                                <TouchableOpacity
                                    key={section}
                                    style={styles.sectionButton}
                                    onPress={() => startSection(section)}
                                    disabled={isStartingSection}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.sectionTitle}>{section}</Text>
                                    <Text style={styles.sectionMeta}>Rozpocznij pytania z tej sekcji</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        );
    }

    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header} edges={['top']}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={20} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tryb nauki</Text>
                    <View style={styles.placeholder} />
                </SafeAreaView>
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie pytań...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={22} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pytanie {currentIndex + 1} z {totalQuestions}</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconBtn} onPress={() => setIsFilterOpen((prev) => !prev)}>
                            <Funnel size={19} color={COLORS.card} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => currentQuestion && toggleBookmark({ questionId: currentQuestion.id, source: 'learning' })}
                        >
                            <Star
                                size={19}
                                color={currentQuestionBookmarked ? COLORS.warning : COLORS.card}
                                fill={currentQuestionBookmarked ? COLORS.warning : 'transparent'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {isFilterOpen && (
                    <View style={styles.filterPanel}>
                        <Text style={styles.filterTitle}>Filtruj pytania</Text>
                        {(['all', 'unanswered', 'wrong', 'correct'] as QuestionFilter[]).map((filterOption) => {
                            const active = questionFilter === filterOption;
                            return (
                                <TouchableOpacity
                                    key={filterOption}
                                    style={[styles.filterOption, active && styles.filterOptionActive]}
                                    onPress={() => selectFilter(filterOption)}
                                >
                                    <Text style={[styles.filterOptionText, active && styles.filterOptionTextActive]}>
                                        {getFilterLabel(filterOption)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={styles.quickNavRow}>
                    <TouchableOpacity
                        onPress={goToPreviousVisibleQuestion}
                        style={[styles.quickArrowBtn, !canGoToPrevious && styles.quickArrowBtnDisabled]}
                        disabled={!canGoToPrevious}
                    >
                        <ChevronLeft size={20} color={!canGoToPrevious ? COLORS.textMuted : COLORS.card} />
                    </TouchableOpacity>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickStepsContainer}>
                        {filteredQuestionIndexes.map((index) => {
                            const isActive = index === currentIndex;
                            const questionId = questionIds[index];
                            const answerState = answersByQuestionId[questionId];
                            const isAnswered = !!answerState;
                            const isCorrectAnswer = !!answerState?.isCorrect;
                            return (
                                <TouchableOpacity
                                    key={`step-${index}`}
                                    style={[
                                        styles.quickStep,
                                        !isAnswered && styles.quickStepUnanswered,
                                        isAnswered && isCorrectAnswer && styles.quickStepCorrect,
                                        isAnswered && !isCorrectAnswer && styles.quickStepWrong,
                                        isActive && styles.quickStepActive,
                                    ]}
                                    onPress={() => goToQuestion(index)}
                                >
                                    <Text style={styles.quickStepText}>{index + 1}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={goToNextVisibleQuestion}
                        style={[styles.quickArrowBtn, !canGoToNext && styles.quickArrowBtnDisabled]}
                        disabled={!canGoToNext}
                    >
                        <ChevronRight size={20} color={!canGoToNext ? COLORS.textMuted : COLORS.card} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>

            <View style={[styles.content, { marginTop: hasAnswered ? -8 : 0 }]}>
                {showAnswerBanner && (
                    <View style={[styles.answerBannerOverlay, isCorrect ? styles.answerBannerCorrect : styles.answerBannerWrong]}>
                        {isCorrect ? (
                            <CheckSquare size={26} color={COLORS.card} />
                        ) : (
                            <XSquare size={26} color={COLORS.card} />
                        )}
                        <Text style={styles.answerBannerText}>{answerStatusText}</Text>
                    </View>
                )}

                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>
                </View>

                <TouchableOpacity style={styles.explainBtn} onPress={() => setShowExplanation((prev) => !prev)}>
                    <Lightbulb size={18} color={COLORS.primary} />
                    <Text style={styles.explainBtnText}>{showExplanation ? 'Ukryj wyjaśnienie pytania' : 'Pokaż wyjaśnienie pytania'}</Text>
                </TouchableOpacity>

                {showExplanation && (
                    <View style={styles.feedback}>
                        <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
                    </View>
                )}

            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[
                        styles.ctaBtn,
                        selectedAnswer === 'A' ? styles.ctaBtnActive : styles.ctaBtnInactive,
                    ]}
                    onPress={() => answerQuestion('A')}
                >
                    <Text style={styles.ctaText}>Tak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.ctaBtn,
                        selectedAnswer === 'B' ? styles.ctaBtnActive : styles.ctaBtnInactive,
                    ]}
                    onPress={() => answerQuestion('B')}
                >
                    <Text style={styles.ctaText}>Nie</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
        paddingBottom: 8,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    filterPanel: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
    },
    filterTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    filterOptionActive: {
        backgroundColor: COLORS.primarySoft,
    },
    filterOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMain,
    },
    filterOptionTextActive: {
        color: COLORS.primary,
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
    },
    quickNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    quickArrowBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickArrowBtnDisabled: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    quickStepsContainer: {
        gap: 8,
        paddingRight: 6,
    },
    quickStep: {
        minWidth: 44,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    quickStepUnanswered: {
        backgroundColor: '#a8a8a8',
    },
    quickStepCorrect: {
        backgroundColor: COLORS.success,
    },
    quickStepWrong: {
        backgroundColor: COLORS.danger,
    },
    quickStepActive: {
        borderColor: COLORS.frame,
    },
    quickStepText: {
        color: COLORS.card,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    answerBannerOverlay: {
        position: 'absolute',
        top: 8,
        left: 0,
        right: 0,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    answerBannerCorrect: {
        backgroundColor: COLORS.success,
    },
    answerBannerWrong: {
        backgroundColor: COLORS.danger,
    },
    answerBannerText: {
        color: COLORS.card,
        fontSize: 20,
        fontWeight: '700',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        fontSize: 16,
        color: COLORS.textMuted,
    },
    questionMeta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    sectionIntro: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    sectionButton: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    sectionMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    options: {
        gap: 12,
    },
    questionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    questionText: {
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '600',
        color: COLORS.textMain,
    },
    explainBtn: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 999,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    explainBtnText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 15,
    },
    feedback: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    feedbackText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    controls: {
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    ctaBtn: {
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    ctaBtnActive: {
        backgroundColor: COLORS.primaryDark,
    },
    ctaBtnInactive: {
        backgroundColor: COLORS.primary,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
    },
});
