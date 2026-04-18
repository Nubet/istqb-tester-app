import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useExamResult } from '@/hooks/useExamResult';

export default function ResultsScreen() {
    const router = useRouter();
    const { result } = useExamResult();

    if (!result) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header} edges={['top']}>
                    <Text style={styles.headerTitle}>Podsumowanie</Text>
                </SafeAreaView>
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie wyników...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <Text style={styles.headerTitle}>Podsumowanie</Text>
            </SafeAreaView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.resultHero}>
                    <Text style={styles.heroTitle}>Wynik egzaminu</Text>
                    <Text style={styles.heroSubtitle}>
                        {result.passed ? 'Gratulacje! Zdałeś egzamin.' : 'Nie udało się tym razem. Spróbuj ponownie!'}
                    </Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreText}>
                            {result.correctAnswers} / {result.totalQuestions} ({result.score}%)
                        </Text>
                    </View>
                </View>

                <View style={styles.stats}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Odpowiedzi poprawne</Text>
                        <Text style={styles.statValue}>{result.correctAnswers}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Odpowiedzi błędne</Text>
                        <Text style={styles.statValue}>{result.totalQuestions - result.correctAnswers}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Czas ukończenia</Text>
                        <Text style={styles.statValue}>{result.timeSpentMinutes}m</Text>
                    </View>
                    {result.recommendations.length > 0 && (
                        <View style={styles.stat}>
                            <Text style={styles.statLabel}>Zalecana powtórka</Text>
                            <Text style={styles.statValue}>{result.recommendations[0]}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.backText}>Wróć na pulpit</Text>
                </TouchableOpacity>
            </ScrollView>
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
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.card,
        textAlign: 'center',
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
    content: {
        flex: 1,
    },
    resultHero: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingBottom: 40,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.card,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 15,
        color: COLORS.card,
        opacity: 0.9,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
    },
    scoreBadge: {
        marginTop: 24,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 100,
        backgroundColor: COLORS.card,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 4,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
    },
    stats: {
        padding: 24,
        gap: 14,
    },
    stat: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    backBtn: {
        marginHorizontal: 24,
        marginTop: 10,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 100,
        padding: 16,
        alignItems: 'center',
        backgroundColor: COLORS.card,
    },
    backText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
    },
});
