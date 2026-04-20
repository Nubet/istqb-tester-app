import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useExamResult } from '@/hooks/useExamResult';
import { ScreenHeader } from '@/ui/ScreenHeader';

const { width } = Dimensions.get('window');
const GRID_PADDING = 16;
const GRID_GAP = 12;
const ITEM_WIDTH = (width - (GRID_PADDING * 2) - (GRID_GAP * 3)) / 4;

export default function ResultsScreen() {
    const router = useRouter();
    const { result } = useExamResult();
    const reviews = useMemo(() => result?.questionReviews ?? [], [result]);

    if (!result) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Wynik egzaminu" />
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie wyników...</Text>
                </View>
            </View>
        );
    }

    const correctCount = result.correctAnswers;
    const totalCount = result.totalQuestions;
    const isPositive = result.passed;

    return (
        <View style={styles.container}>
            <ScreenHeader title="Wynik egzaminu" showBack onBack={() => router.replace('/')} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(correctCount / totalCount) * 100}%` }]} />
                    </View>
                    <Text style={styles.scoreText}>{correctCount} / {totalCount} pkt</Text>
                </View>

                <View style={styles.resultBanner}>
                    <Text style={[styles.resultText, isPositive ? styles.resultPositive : styles.resultNegative]}>
                        {isPositive ? 'POZYTYWNY' : 'NEGATYWNY'}
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>
                        Pytania w których została udzielona błędna odpowiedź, zostały oznaczone kolorem czerwonym. Wybierz pytanie, aby przejrzeć poprawne odpowiedzi.
                    </Text>
                </View>

                <View style={styles.gridContainer}>
                    {reviews.map((review, index) => {
                        const isCorrect = review.isCorrect;

                        return (
                            <TouchableOpacity
                                key={review.questionId}
                                style={[
                                    styles.gridItem,
                                    isCorrect ? styles.gridItemCorrect : styles.gridItemWrong,
                                ]}
                                onPress={() => router.push(`/review?questionId=${review.questionId}&questionNumber=${review.questionNumber}`)}
                            >
                                <Text
                                    style={[
                                        styles.gridItemText,
                                        isCorrect ? styles.gridItemTextCorrect : styles.gridItemTextWrong
                                    ]}
                                >
                                    {review.questionNumber}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        fontSize: 16,
        color: COLORS.textMuted,
        fontFamily: 'Nunito_400Regular',
    },
    content: {
        flex: 1,
    },
    progressSection: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    scoreText: {
        fontSize: 16,
        color: COLORS.textMain,
        fontWeight: '600',
        fontFamily: 'Nunito_600SemiBold',
    },
    resultBanner: {
        backgroundColor: COLORS.card,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    resultText: {
        fontSize: 24,
        fontWeight: '800',
        fontFamily: 'Nunito_800ExtraBold',
    },
    resultPositive: {
        color: COLORS.success,
    },
    resultNegative: {
        color: COLORS.danger,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
    },
    infoText: {
        fontSize: 15,
        color: COLORS.textMain,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'Nunito_500Medium',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: GRID_PADDING,
        gap: GRID_GAP,
        paddingBottom: 24,
    },
    gridItem: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    gridItemCorrect: {
        backgroundColor: COLORS.primary,
    },
    gridItemWrong: {
        backgroundColor: COLORS.card,
    },
    gridItemText: {
        fontSize: 26,
        fontWeight: '800',
        fontFamily: 'Nunito_800ExtraBold',
    },
    gridItemTextCorrect: {
        color: COLORS.card,
    },
    gridItemTextWrong: {
        color: COLORS.danger,
    },
    bottomSpacer: {
        height: 40,
    },
});