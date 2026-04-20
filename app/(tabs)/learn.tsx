import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Star, Funnel, ChevronLeft, ChevronRight, Lightbulb, CheckSquare, XSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { scaleValue } from '@/constants/readingDensity';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { useLearningSession } from '@/hooks/useLearningSession';
import { useReadingPreferences } from '@/hooks/useReadingPreferences';
import { useHorizontalSwipe } from '@/hooks/useHorizontalSwipe';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { AnswerId } from '@/types';

type QuestionFilter = 'all' | 'unanswered' | 'wrong' | 'correct';

export default function LearnScreen() {
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
    const { density } = useReadingPreferences();

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

    const goToPreviousVisibleQuestion = useCallback(() => {
        if (!canGoToPrevious) return;
        goToQuestion(filteredQuestionIndexes[currentFilteredPosition - 1]);
    }, [canGoToPrevious, currentFilteredPosition, filteredQuestionIndexes, goToQuestion]);

    const goToNextVisibleQuestion = useCallback(() => {
        if (!canGoToNext) return;
        goToQuestion(filteredQuestionIndexes[currentFilteredPosition + 1]);
    }, [canGoToNext, currentFilteredPosition, filteredQuestionIndexes, goToQuestion]);

    const { panHandlers, pan } = useHorizontalSwipe({
        onSwipeLeft: goToNextVisibleQuestion,
        onSwipeRight: goToPreviousVisibleQuestion,
    });

    const selectFilter = (filter: QuestionFilter) => {
        setQuestionFilter(filter);
        setIsFilterOpen(false);
    };

    const dynamicStyles = useMemo(() => ({
        content: {
            paddingHorizontal: scaleValue(16, density.spacingScale, 12),
            paddingTop: scaleValue(16, density.spacingScale, 12),
        },
        scrollContent: {
            paddingBottom: scaleValue(32, density.spacingScale, 20),
        },
        questionCard: {
            padding: scaleValue(20, density.spacingScale, 14),
            marginBottom: scaleValue(12, density.spacingScale, 8),
        },
        questionText: {
            fontSize: scaleValue(18, density.textScale, 15),
            lineHeight: scaleValue(25, density.textScale, 21),
        },
        explainButton: {
            paddingVertical: scaleValue(12, density.spacingScale, 10),
            paddingHorizontal: scaleValue(16, density.spacingScale, 12),
            gap: scaleValue(8, density.spacingScale, 6),
        },
        explainButtonText: {
            fontSize: scaleValue(15, density.textScale, 13),
        },
        feedback: {
            padding: scaleValue(16, density.spacingScale, 12),
            marginTop: scaleValue(10, density.spacingScale, 8),
        },
        feedbackText: {
            fontSize: scaleValue(14, density.textScale, 12),
            lineHeight: scaleValue(20, density.textScale, 17),
        },
        controls: {
            gap: scaleValue(12, density.answerSpacingScale, 6),
            paddingHorizontal: scaleValue(16, density.answerSpacingScale, 10),
            paddingBottom: scaleValue(16, density.answerSpacingScale, 10),
            paddingTop: scaleValue(8, density.answerSpacingScale, 5),
        },
        answerButton: {
            padding: scaleValue(16, density.answerSpacingScale, 10),
            gap: scaleValue(12, density.answerSpacingScale, 7),
            minHeight: density.optionMinHeight,
        },
        answerLetterContainer: {
            width: scaleValue(32, density.answerSpacingScale, 26),
            height: scaleValue(32, density.answerSpacingScale, 26),
            borderRadius: scaleValue(16, density.answerSpacingScale, 13),
        },
        answerLetterText: {
            fontSize: scaleValue(15, density.answerTextScale, 12),
        },
        answerText: {
            fontSize: scaleValue(15, density.answerTextScale, 12),
            lineHeight: scaleValue(22, density.answerTextScale, 17),
        },
    }), [density.answerSpacingScale, density.answerTextScale, density.optionMinHeight, density.spacingScale, density.textScale]);

    const getFilterLabel = (filter: QuestionFilter) => {
        if (filter === 'all') return 'Wszystkie';
        if (filter === 'unanswered') return 'Bez odpowiedzi';
        if (filter === 'wrong') return 'Błędne odpowiedzi';
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
                <ScreenHeader title="Tryb nauki" />

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
                <ScreenHeader title="Tryb nauki" />
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie pytań...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={`Pytanie ${currentIndex + 1} z ${totalQuestions}`}
                rightActions={
                    <>
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
                    </>
                }
            >
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
            </ScreenHeader>

            <Animated.View 
                style={[
                    styles.content, 
                    dynamicStyles.content,
                    { 
                        marginTop: hasAnswered ? -8 : 0, 
                        transform: [{ translateX: pan }],
                        opacity: pan.interpolate({
                            inputRange: [-400, 0, 400],
                            outputRange: [0, 1, 0],
                            extrapolate: 'clamp',
                        })
                    }
                ]} 
                {...panHandlers}
            >
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

                <ScrollView 
                    style={{ flex: 1 }} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[{ flexGrow: 1 }, dynamicStyles.scrollContent]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={[styles.questionCard, dynamicStyles.questionCard]}>
                        <Text style={[styles.questionText, dynamicStyles.questionText]}>{currentQuestion.text}</Text>
                    </View>

                    <TouchableOpacity style={[styles.explainBtn, dynamicStyles.explainButton]} onPress={() => setShowExplanation((prev) => !prev)}>
                        <Lightbulb size={18} color={COLORS.primary} />
                        <Text style={[styles.explainBtnText, dynamicStyles.explainButtonText]}>{showExplanation ? 'Ukryj wyjaśnienie pytania' : 'Pokaż wyjaśnienie pytania'}</Text>
                    </TouchableOpacity>

                    {showExplanation && (
                        <View style={[styles.feedback, dynamicStyles.feedback]}>
                            <Text style={[styles.feedbackText, dynamicStyles.feedbackText]}>{currentQuestion.explanation}</Text>
                        </View>
                    )}
                </ScrollView>
            </Animated.View>

            <View style={[styles.controls, dynamicStyles.controls]}>
                {(['A', 'B', 'C', 'D'] as AnswerId[]).map((optionId) => {
                    const isSelected = selectedAnswer === optionId;
                    const isCorrectOption = optionId === currentQuestion.correctAnswer;
                    
                    let containerStyle: any = styles.ctaBtnInactive;
                    let textStyle: any = styles.ctaTextLeft;
                    let letterContainerStyle: any = styles.optionLetterContainer;
                    let letterTextStyle: any = styles.optionLetterText;

                    if (hasAnswered) {
                        if (isSelected && isCorrectOption) {
                            containerStyle = styles.ctaBtnCorrect;
                            textStyle = styles.ctaTextLeftActive;
                            letterContainerStyle = styles.optionLetterContainerActive;
                            letterTextStyle = styles.optionLetterTextActive;
                        } else if (isSelected && !isCorrectOption) {
                            containerStyle = styles.ctaBtnWrong;
                            textStyle = styles.ctaTextLeftActive;
                            letterContainerStyle = styles.optionLetterContainerActive;
                            letterTextStyle = styles.optionLetterTextActive;
                        } else if (isCorrectOption) {
                            containerStyle = styles.ctaBtnCorrectOutline;
                            textStyle = styles.ctaTextLeftOutline;
                            letterContainerStyle = styles.optionLetterContainerOutline;
                            letterTextStyle = styles.optionLetterTextOutline;
                        } else {
                            containerStyle = styles.ctaBtnDisabled;
                        }
                    } else if (isSelected) {
                        containerStyle = styles.ctaBtnActive;
                    }

                    return (
                        <TouchableOpacity
                            key={optionId}
                            style={[styles.ctaBtn, containerStyle, dynamicStyles.answerButton]}
                            onPress={() => answerQuestion(optionId)}
                            disabled={hasAnswered}
                            activeOpacity={0.7}
                        >
                            <View style={[letterContainerStyle, dynamicStyles.answerLetterContainer]}>
                                <Text style={[letterTextStyle, dynamicStyles.answerLetterText]}>{optionId}</Text>
                            </View>
                            <Text style={[textStyle, dynamicStyles.answerText]}>{currentQuestion.options[optionId]}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
        minHeight: 0,
        paddingHorizontal: 16,
        paddingTop: 16,
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
        flexShrink: 0,
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
    ctaBtn: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ctaBtnActive: {
        backgroundColor: COLORS.primaryDark,
    },
    ctaBtnInactive: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    ctaBtnCorrect: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
        borderWidth: 1,
    },
    ctaBtnWrong: {
        backgroundColor: COLORS.danger,
        borderColor: COLORS.danger,
        borderWidth: 1,
    },
    ctaBtnCorrectOutline: {
        backgroundColor: COLORS.successSoft,
        borderColor: COLORS.success,
        borderWidth: 1,
    },
    ctaBtnDisabled: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: 0.5,
    },
    optionLetterContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLetterContainerActive: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLetterContainerOutline: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionLetterText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    optionLetterTextActive: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.card,
    },
    optionLetterTextOutline: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.card,
    },
    ctaTextLeft: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '500',
        color: COLORS.textMain,
    },
    ctaTextLeftActive: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        color: COLORS.card,
    },
    ctaTextLeftOutline: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        color: COLORS.textMain,
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
    },
});
