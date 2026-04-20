import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Clock, Flag, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COLORS } from '@/constants/colors';
import { scaleValue } from '@/constants/readingDensity';
import { useExam } from '@/hooks/useExam';
import { useHorizontalSwipe } from '@/hooks/useHorizontalSwipe';
import { useReadingPreferences } from '@/hooks/useReadingPreferences';
import { OptionButton } from '@/ui/OptionButton';

export default function ExamRunScreen() {
    const insets = useSafeAreaInsets();
    const quickStepsScrollRef = useRef<ScrollView>(null);
    const quickStepXPositionsRef = useRef<Record<number, number>>({});
    const {
        currentQuestion,
        currentIndex,
        questionIds,
        totalQuestions,
        timeRemaining,
        selectedAnswer,
        answeredQuestionIds,
        flaggedQuestionIds,
        isFlagged,
        goToQuestion,
        goToNextQuestion,
        goToPreviousQuestion,
        answerQuestion,
        toggleFlag,
        finishExam,
    } = useExam();
    const { density } = useReadingPreferences();

    const canGoToPrevious = currentIndex > 0;
    const canGoToNext = currentIndex < totalQuestions - 1;

    const { panHandlers, pan } = useHorizontalSwipe({
        onSwipeLeft: goToNextQuestion,
        onSwipeRight: goToPreviousQuestion,
        canSwipeLeft: canGoToNext,
        canSwipeRight: canGoToPrevious,
    });

    const [timer, setTimer] = useState('59:59');
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [isFinishingExam, setIsFinishingExam] = useState(false);

    const dynamicStyles = useMemo(() => ({
        header: {
            paddingTop: Math.max(insets.top + 8, 20),
            paddingBottom: scaleValue(20, density.spacingScale, 14),
        },
        content: {
            padding: scaleValue(24, density.spacingScale, 16),
        },
        quickNavRow: {
            gap: scaleValue(8, density.spacingScale, 6),
            marginTop: scaleValue(14, density.spacingScale, 10),
        },
        quickArrowBtn: {
            width: scaleValue(36, density.spacingScale, 34),
            height: scaleValue(36, density.spacingScale, 34),
            borderRadius: scaleValue(10, density.spacingScale, 8),
        },
        quickStepsContainer: {
            gap: scaleValue(8, density.spacingScale, 6),
            paddingRight: 6,
        },
        quickStep: {
            minWidth: scaleValue(44, density.spacingScale, 42),
            height: scaleValue(36, density.spacingScale, 34),
            borderRadius: scaleValue(8, density.spacingScale, 8),
            paddingHorizontal: scaleValue(10, density.spacingScale, 8),
        },
        quickStepText: {
            fontSize: scaleValue(13, density.textScale, 12),
        },
        questionMeta: {
            fontSize: scaleValue(13, density.textScale, 12),
            marginBottom: scaleValue(16, density.spacingScale, 10),
        },
        questionCard: {
            padding: scaleValue(24, density.spacingScale, 16),
            marginBottom: scaleValue(16, density.spacingScale, 10),
        },
        questionText: {
            fontSize: scaleValue(19, density.textScale, 16),
            lineHeight: scaleValue(26, density.textScale, 22),
        },
        options: {
            gap: scaleValue(12, density.answerSpacingScale, 7),
        },
        contentBottomSpacer: {
            paddingBottom: scaleValue(16, density.answerSpacingScale, 10) + insets.bottom,
        },
    }), [density.answerSpacingScale, density.spacingScale, density.textScale, insets.bottom, insets.top]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            return;
        }

        setTimer('00:00');
    }, [timeRemaining]);

    useEffect(() => {
        const x = quickStepXPositionsRef.current[currentIndex];
        if (x === undefined) return;

        quickStepsScrollRef.current?.scrollTo({
            x: Math.max(0, x - 2),
            animated: true,
        });
    }, [currentIndex]);

    const handleConfirmExit = () => {
        setShowExitConfirm(true);
    };

    const handleCancelExit = () => {
        if (isFinishingExam) return;
        setShowExitConfirm(false);
    };

    const handleFinishExamFromModal = async () => {
        if (isFinishingExam) return;

        setIsFinishingExam(true);
        try {
            await finishExam();
        } finally {
            setIsFinishingExam(false);
            setShowExitConfirm(false);
        }
    };

    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie egzaminu...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, dynamicStyles.header]}>
                <TouchableOpacity onPress={handleConfirmExit} style={styles.iconBtn} hitSlop={12}>
                    <X size={20} color={COLORS.card} />
                </TouchableOpacity>

                <View style={styles.timer}>
                    <Clock size={16} color={COLORS.card} />
                    <Text style={styles.timerText}>{timer}</Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.iconBtn, isFlagged && styles.iconBtnActive]}
                        onPress={toggleFlag}
                    >
                        <Flag size={20} color={isFlagged ? COLORS.warning : COLORS.card} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.quickNavRow, dynamicStyles.quickNavRow]}>
                <TouchableOpacity
                    onPress={goToPreviousQuestion}
                    style={[styles.quickArrowBtn, dynamicStyles.quickArrowBtn, !canGoToPrevious && styles.quickArrowBtnDisabled]}
                    disabled={!canGoToPrevious}
                >
                    <ChevronLeft size={20} color={!canGoToPrevious ? COLORS.textMuted : COLORS.card} />
                </TouchableOpacity>

                <ScrollView
                    ref={quickStepsScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.quickStepsContainer, dynamicStyles.quickStepsContainer]}
                >
                    {questionIds.map((questionId, index) => {
                        const isActive = index === currentIndex;
                        const isAnswered = answeredQuestionIds.includes(questionId);
                        const isFlaggedQuestion = flaggedQuestionIds.includes(questionId);

                        return (
                            <TouchableOpacity
                                key={`exam-step-${questionId}`}
                                onLayout={(event) => {
                                    quickStepXPositionsRef.current[index] = event.nativeEvent.layout.x;
                                }}
                                style={[
                                    styles.quickStep,
                                    dynamicStyles.quickStep,
                                    !isAnswered && styles.quickStepUnanswered,
                                    isAnswered && styles.quickStepAnswered,
                                    isFlaggedQuestion && styles.quickStepFlagged,
                                    isActive && styles.quickStepActive,
                                ]}
                                onPress={() => goToQuestion(index)}
                            >
                                <Text style={[styles.quickStepText, dynamicStyles.quickStepText]}>{index + 1}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity
                    onPress={goToNextQuestion}
                    style={[styles.quickArrowBtn, dynamicStyles.quickArrowBtn, !canGoToNext && styles.quickArrowBtnDisabled]}
                    disabled={!canGoToNext}
                >
                    <ChevronRight size={20} color={!canGoToNext ? COLORS.textMuted : COLORS.card} />
                </TouchableOpacity>
            </View>

            <Animated.View
                style={[
                    styles.content,
                    dynamicStyles.content,
                    {
                        transform: [{ translateX: pan }],
                        opacity: pan.interpolate({
                            inputRange: [-400, 0, 400],
                            outputRange: [0, 1, 0],
                            extrapolate: 'clamp',
                        }),
                    },
                ]}
                {...panHandlers}
            >
                <Text style={[styles.questionMeta, dynamicStyles.questionMeta]}>
                    Pytanie {currentIndex + 1}/{totalQuestions}
                </Text>

                <View style={[styles.questionCard, dynamicStyles.questionCard]}>
                    <Text style={[styles.questionText, dynamicStyles.questionText]}>{currentQuestion.text}</Text>
                </View>

                <View style={[styles.options, dynamicStyles.options]}>
                    {(['A', 'B', 'C', 'D'] as const).map((option) => (
                        <OptionButton
                            key={option}
                            option={option}
                            text={currentQuestion.options[option]}
                            selected={selectedAnswer === option}
                            onPress={() => answerQuestion(option)}
                        />
                    ))}
                </View>

                <View style={dynamicStyles.contentBottomSpacer} />
            </Animated.View>

            {showExitConfirm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Zakończyć egzamin?</Text>
                        <Text style={styles.modalText}>
                            Po zakończeniu przejdziesz do podsumowania. Tej sesji nie będzie można kontynuować.
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnGhost, isFinishingExam && styles.modalBtnDisabled]}
                                onPress={handleCancelExit}
                                disabled={isFinishingExam}
                            >
                                <Text style={styles.modalBtnGhostText}>Anuluj</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnDanger, isFinishingExam && styles.modalBtnDisabled]}
                                onPress={handleFinishExamFromModal}
                                disabled={isFinishingExam}
                            >
                                <Text style={styles.modalBtnDangerText}>
                                    {isFinishingExam ? 'Przetwarzanie...' : 'Zakończ i pokaż podsumowanie'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBtnActive: {
        backgroundColor: COLORS.card,
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 100,
    },
    timerText: {
        color: COLORS.card,
        fontSize: 15,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    quickNavRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        marginTop: 14,
    },
    quickArrowBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickArrowBtnDisabled: {
        backgroundColor: COLORS.border,
    },
    quickStepsContainer: {
        gap: 8,
        paddingRight: 6,
    },
    quickStep: {
        minWidth: 44,
        height: 36,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    quickStepUnanswered: {
        backgroundColor: '#b7b7b7',
    },
    quickStepAnswered: {
        backgroundColor: '#7f9fb8',
    },
    quickStepFlagged: {
        backgroundColor: COLORS.warning,
    },
    quickStepActive: {
        borderColor: 'rgba(255,255,255,0.92)',
    },
    quickStepText: {
        color: COLORS.card,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        padding: 24,
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
    questionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    questionText: {
        fontSize: 19,
        lineHeight: 26,
        fontWeight: '700',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    options: {
        gap: 12,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.36)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    modalText: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    modalActions: {
        marginTop: 16,
        gap: 10,
    },
    modalBtn: {
        minHeight: 46,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    modalBtnGhost: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalBtnDanger: {
        backgroundColor: COLORS.danger,
    },
    modalBtnGhostText: {
        color: COLORS.textMain,
        fontWeight: '700',
        fontSize: 14,
    },
    modalBtnDangerText: {
        color: COLORS.card,
        fontWeight: '700',
        fontSize: 14,
    },
    modalBtnDisabled: {
        opacity: 0.55,
    },
});
