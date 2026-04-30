import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Layers3, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { FLASHCARD_DECKS_QUERY_KEY } from '@/constants/queryKeys';
import { glossaryService } from '@/services';
import type { FlashcardDeckSummary } from '@/types';

const ALL_DECK_ID = '__all__';

export default function FlashcardsDecksScreen() {
    const router = useRouter();
    const { data: deckSummaries = [], isLoading, isError } = useQuery({
        queryKey: FLASHCARD_DECKS_QUERY_KEY,
        queryFn: () => glossaryService.getDeckSummaries(),
    });

    const startSession = (deckId: string, mode: 'all' | 'learning' = 'all') => {
        router.push({
            pathname: '/glossary/flashcards/session',
            params: { deck: deckId, mode },
        });
    };

    return (
        <View style={styles.container}>
            <ScreenHeader title="Fiszki" showBack />

            <View style={styles.content}>
                <Text style={styles.intro}>Wybierz zestaw i ćwicz pojęcia</Text>

                {isLoading ? (
                    <View style={styles.center}>
                        <Text style={styles.infoText}>Ładowanie zestawów...</Text>
                    </View>
                ) : isError ? (
                    <View style={styles.center}>
                        <Text style={styles.infoText}>Nie udało się załadować zestawów.</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.scroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.options}
                    >
                        {deckSummaries.map((deck: FlashcardDeckSummary) => {
                            const hasLearning = deck.learningCards > 0;
                            const isFinished = deck.progressPercentage >= 100 && deck.totalCards > 0;

                            return (
                                <View key={deck.id} style={styles.deckCard}>
                                    <TouchableOpacity
                                        style={styles.deckCardMain}
                                        activeOpacity={0.8}
                                        onPress={() => startSession(deck.id, 'all')}
                                    >
                                        <View style={[styles.deckIconWrap, isFinished ? styles.deckIconWrapSuccess : undefined]}>
                                            <Layers3 size={20} color={isFinished ? COLORS.card : COLORS.primary} />
                                        </View>
                                        <View style={styles.deckTextWrap}>
                                            <Text style={styles.deckTitle} numberOfLines={2}>{deck.title}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <View style={styles.deckFooter}>
                                        <View style={styles.deckMetrics}>
                                            <View style={styles.deckMetric}>
                                                <View style={styles.deckMetricIcon}>
                                                    <Layers3 size={14} color={COLORS.textMuted} />
                                                </View>
                                                <Text style={styles.deckMetricText}>{deck.totalCards} kart</Text>
                                            </View>
                                        </View>

                                        <View style={styles.deckProgressWrap}>
                                            <View style={styles.deckProgressHeader}>
                                                <Text style={styles.deckProgressLabel}>Opanowane</Text>
                                                <Text style={styles.deckProgressValue}>{deck.progressPercentage}%</Text>
                                            </View>
                                            <View style={styles.deckProgressBar}>
                                                <View style={[styles.deckProgressFill, { width: `${deck.progressPercentage}%` }]} />
                                            </View>
                                        </View>
                                    </View>

                                    {hasLearning && (
                                        <TouchableOpacity
                                            style={styles.deckRepeatBtn}
                                            onPress={() => startSession(deck.id, 'learning')}
                                            activeOpacity={0.7}
                                        >
                                            <AlertTriangle size={16} color={COLORS.warning} />
                                            <Text style={styles.deckRepeatBtnText}>
                                                Powtórz {deck.learningCards} {deck.learningCards === 1 ? 'kartę' : (deck.learningCards % 10 >= 2 && deck.learningCards % 10 <= 4 && (deck.learningCards % 100 < 10 || deck.learningCards % 100 >= 20)) ? 'karty' : 'kart'}
                                            </Text>
                                            <ChevronRight size={16} color={COLORS.warning} style={{ marginLeft: 'auto' }} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    intro: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: 15,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    scroll: {
        flex: 1,
    },
    options: {
        gap: 16,
        paddingBottom: 32,
    },
    deckCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    deckCardMain: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    deckIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: COLORS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    deckIconWrapSuccess: {
        backgroundColor: COLORS.success,
    },
    deckTextWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    deckTitle: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    deckFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 16,
    },
    deckMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deckMetric: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    deckMetricIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deckMetricText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    deckProgressWrap: {
        flex: 1,
        maxWidth: 120,
    },
    deckProgressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    deckProgressLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    deckProgressValue: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.primaryDark,
    },
    deckProgressBar: {
        height: 8,
        backgroundColor: COLORS.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    deckProgressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    deckRepeatBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: COLORS.warningSoft,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    deckRepeatBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.warning,
    },
});
