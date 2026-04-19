import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf, BookOpen, Star, Settings, LeafyGreen } from 'lucide-react-native';
import { ProgressRing } from '@/ui/ProgressRing';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function HomeScreen() {
    const router = useRouter();
    const { progress, completionPercentage, totalQuestions } = useUserProgress();

    const stats = {
        answered: progress?.completedQuestionIds.length || 0,
        bookmarked: progress?.bookmarkedQuestionIds.length || 0,
        total: totalQuestions || 0,
    };

    return (
        <View style={styles.container}>
            <ScreenHeader bottomRadius={false} containerStyle={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Testy ISTQB</Text>
                    <Text style={styles.subtitle}>Przygotuj się i zdaj za pierwszym razem.</Text>
                </View>
            </ScreenHeader>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.progressRow}>
                        <View style={styles.progressText}>
                            <Text style={styles.cardTitle}>Postęp przygotowań</Text>
                            <Text style={styles.meta}>
                                {stats.answered}/{stats.total} pytań przerobionych, {stats.bookmarked} oznaczonych do powtórki.
                            </Text>
                        </View>
                        <ProgressRing percentage={completionPercentage} />
                    </View>
                </View>

                <TouchableOpacity style={styles.cta} onPress={() => router.push('/exam-info')}>
                    <LeafyGreen size={20} color={COLORS.card} />
                    <Text style={styles.ctaText}>Rozpocznij egzamin próbny</Text>
                </TouchableOpacity>

                <View style={styles.grid}>
                    <TouchableOpacity style={styles.tile} onPress={() => router.push('/learn')}>
                        <View style={styles.iconContainer}>
                            <Leaf size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.tileTitle}>Tryb nauki</Text>
                        <Text style={styles.tileMeta}>Pytania z wyjaśnieniami</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => router.push('/glossary')}>
                        <View style={styles.iconContainer}>
                            <BookOpen size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.tileTitle}>Glosariusz</Text>
                        <Text style={styles.tileMeta}>Słownik pojęć i definicji</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => router.push('/bookmarks')}>
                        <View style={styles.iconContainer}>
                            <Star size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.tileTitle}>Oznaczone</Text>
                        <Text style={styles.tileMeta}>Do powtórki na później</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tile} onPress={() => router.push('/profile')}>
                        <View style={styles.iconContainer}>
                            <Settings size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.tileTitle}>Ustawienia</Text>
                        <Text style={styles.tileMeta}>Dopasuj aplikację pod siebie.</Text>
                    </TouchableOpacity>
                </View>
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
        paddingBottom: 30,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    headerContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.card,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.card,
        opacity: 0.9,
        marginTop: 8,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
        marginBottom: 16,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressText: {
        flex: 1,
        marginRight: 20,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    meta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginTop: 4,
        lineHeight: 18,
    },
    cta: {
        backgroundColor: COLORS.primary,
        borderRadius: 100,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 4,
    },
    ctaText: {
        color: COLORS.card,
        fontSize: 16,
        fontWeight: '700',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    tile: {
        width: '47%',
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    tileTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    tileMeta: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 16,
    },
});
