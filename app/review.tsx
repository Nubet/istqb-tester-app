import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, Lightbulb } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS } from '@/constants/colors';
import { useExamResult } from '@/hooks/useExamResult';
import { useBookmarks } from '@/hooks/useBookmarks';
import { learningService } from '@/services';
import { ScreenHeader } from '@/ui/ScreenHeader';

export default function ReviewScreen() {
    const router = useRouter();
    const { questionId, questionNumber } = useLocalSearchParams<{ questionId: string, questionNumber: string }>();
    const { result } = useExamResult();
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [showExplanation, setShowExplanation] = useState(false);

    const reviewData = useMemo(() => {
        return result?.questionReviews.find(r => r.questionId === questionId);
    }, [result, questionId]);

    const { data: questions } = useQuery({
        queryKey: ['reviewQuestion', questionId],
        queryFn: () => questionId ? learningService.getSessionQuestions([questionId]) : Promise.resolve([]),
        enabled: !!questionId,
    });

    const fullQuestion = questions?.[0];

    if (!reviewData) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Błąd ładowania" showBack />
                <View style={styles.center}>
                    <Text style={styles.loading}>Nie znaleziono pytania</Text>
                </View>
            </View>
        );
    }

    const isStarred = isBookmarked(questionId as string);

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={`Pytanie ${questionNumber}`}
                showBack
                rightActions={
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => toggleBookmark({ questionId: questionId as string, source: 'exam' })}
                    >
                        <Star
                            size={19}
                            color={isStarred ? COLORS.warning : COLORS.card}
                            fill={isStarred ? COLORS.warning : 'transparent'}
                        />
                    </TouchableOpacity>
                }
            />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.category}>{reviewData.category}</Text>
                <Text style={styles.questionText}>{reviewData.questionText}</Text>

                <View style={styles.optionsList}>
                    {(['A', 'B', 'C', 'D'] as const).map((optionId) => {
                        const isSelected = reviewData.selectedAnswer === optionId;
                        const isCorrect = reviewData.correctAnswer === optionId;
                        
                        let optionStyle: any = styles.optionContainer;
                        let letterStyle: any = styles.optionLetter;
                        let textStyle: any = styles.optionText;

                        if (isCorrect) {
                            optionStyle = [styles.optionContainer, styles.optionCorrect];
                            letterStyle = [styles.optionLetter, styles.optionLetterCorrect];
                            textStyle = [styles.optionText, styles.optionTextCorrect];
                        } else if (isSelected) {
                            optionStyle = [styles.optionContainer, styles.optionWrong];
                            letterStyle = [styles.optionLetter, styles.optionLetterWrong];
                            textStyle = [styles.optionText, styles.optionTextWrong];
                        }

                        return (
                            <View key={optionId} style={optionStyle}>
                                <View style={styles.optionLetterContainer}>
                                    <Text style={letterStyle}>{optionId}</Text>
                                </View>
                                <Text style={textStyle}>{reviewData.options[optionId]}</Text>
                            </View>
                        );
                    })}
                </View>

                {fullQuestion?.explanation && (
                    <View style={styles.explanationSection}>
                        {!showExplanation ? (
                            <TouchableOpacity 
                                style={styles.explainBtn} 
                                onPress={() => setShowExplanation(true)}
                            >
                                <Lightbulb size={18} color={COLORS.primary} />
                                <Text style={styles.explainBtnText}>Pokaż wyjaśnienie pytania</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.explanationBox}>
                                <View style={styles.explanationHeader}>
                                    <Lightbulb size={22} color={COLORS.primary} />
                                    <Text style={styles.explanationTitle}>Wyjaśnienie</Text>
                                </View>
                                <Text style={styles.explanationText}>{fullQuestion.explanation}</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
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
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        fontFamily: 'Nunito_500Medium',
        fontSize: 16,
        color: COLORS.textMuted,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 60,
    },
    category: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 13,
        color: COLORS.primary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    questionText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 18,
        color: COLORS.textMain,
        lineHeight: 26,
        marginBottom: 32,
    },
    optionsList: {
        gap: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    optionCorrect: {
        backgroundColor: COLORS.successSoft,
        borderColor: COLORS.success,
    },
    optionWrong: {
        backgroundColor: COLORS.dangerSoft,
        borderColor: COLORS.danger,
    },
    optionLetterContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionLetter: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15,
        color: COLORS.textMuted,
    },
    optionLetterCorrect: {
        color: COLORS.success,
    },
    optionLetterWrong: {
        color: COLORS.danger,
    },
    optionText: {
        flex: 1,
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 15,
        color: COLORS.textMain,
        lineHeight: 22,
    },
    optionTextCorrect: {
        color: COLORS.success,
        fontFamily: 'Nunito_700Bold',
    },
    optionTextWrong: {
        color: COLORS.danger,
        fontFamily: 'Nunito_700Bold',
    },
    explanationSection: {
        marginTop: 32,
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
        fontFamily: 'Nunito_700Bold',
    },
    explanationBox: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    explanationTitle: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: COLORS.primary,
        marginLeft: 8,
    },
    explanationText: {
        fontFamily: 'Nunito_500Medium',
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.textMain,
    },
});
