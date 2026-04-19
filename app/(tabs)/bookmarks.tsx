import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Star, Lightbulb, CheckSquare, XSquare } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { useHorizontalSwipe } from '@/hooks/useHorizontalSwipe';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { AnswerId } from '@/types';

export default function BookmarksScreen() {
    const router = useRouter();
    const { questions, isEmpty, isLoadingQuestions, toggleBookmark, isBookmarked } = useBookmarks();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerId | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showAnswerBanner, setShowAnswerBanner] = useState(false);

    // Keep currentIndex within bounds if questions change (e.g. unbookmarking)
    useEffect(() => {
        if (questions.length > 0 && currentIndex >= questions.length) {
            setCurrentIndex(Math.max(0, questions.length - 1));
            resetState();
        } else if (questions.length === 0) {
            setCurrentIndex(0);
            resetState();
        }
    }, [questions.length, currentIndex]);

    const resetState = () => {
        setShowExplanation(false);
        setSelectedAnswer(null);
        setHasAnswered(false);
        setIsCorrect(false);
        setShowAnswerBanner(false);
    };

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const canGoToPrevious = currentIndex > 0;
    const canGoToNext = currentIndex < totalQuestions - 1;
    const currentQuestionBookmarked = currentQuestion ? isBookmarked(currentQuestion.id) : false;
    const answerStatusText = isCorrect ? 'Odpowiedź poprawna' : 'Odpowiedź błędna';

    const goToPreviousVisibleQuestion = useCallback(() => {
        if (!canGoToPrevious) return;
        setCurrentIndex((prev) => prev - 1);
        resetState();
    }, [canGoToPrevious]);

    const goToNextVisibleQuestion = useCallback(() => {
        if (!canGoToNext) return;
        setCurrentIndex((prev) => prev + 1);
        resetState();
    }, [canGoToNext]);

    const { panHandlers, pan } = useHorizontalSwipe({
        onSwipeLeft: goToNextVisibleQuestion,
        onSwipeRight: goToPreviousVisibleQuestion,
    });

    const handleAnswerQuestion = (optionId: AnswerId) => {
        if (hasAnswered || !currentQuestion) return;

        setSelectedAnswer(optionId);
        setHasAnswered(true);
        const correct = optionId === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowAnswerBanner(true);
        
        setTimeout(() => {
            setShowAnswerBanner(false);
        }, 2000);
    };

    const handleToggleBookmark = () => {
        if (!currentQuestion) return;
        toggleBookmark({ questionId: currentQuestion.id, source: 'learning' });
    };

    if (isEmpty || questions.length === 0) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Oznaczone" />

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>
                            Aktualnie nie posiadasz żadnych oznaczonych pytań.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (isLoadingQuestions || !currentQuestion) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Oznaczone" />
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
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={handleToggleBookmark}
                    >
                        <Star
                            size={19}
                            color={currentQuestionBookmarked ? COLORS.warning : COLORS.card}
                            fill={currentQuestionBookmarked ? COLORS.warning : 'transparent'}
                        />
                    </TouchableOpacity>
                }
            />

            <Animated.View 
                style={[
                    styles.content, 
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
                    contentContainerStyle={{ paddingBottom: 32, flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
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
                </ScrollView>
            </Animated.View>

            <View style={styles.controls}>
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
                            style={[styles.ctaBtn, containerStyle]}
                            onPress={() => handleAnswerQuestion(optionId)}
                            disabled={hasAnswered}
                            activeOpacity={0.7}
                        >
                            <View style={letterContainerStyle}>
                                <Text style={letterTextStyle}>{optionId}</Text>
                            </View>
                            <Text style={textStyle}>{currentQuestion.options[optionId]}</Text>
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
        borderRadius: 12,
    },
    answerBannerCorrect: {
        backgroundColor: COLORS.success,
    },
    answerBannerWrong: {
        backgroundColor: COLORS.danger,
    },
    answerBannerText: {
        color: COLORS.card,
        fontSize: 18,
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
    empty: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 20,
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
});
