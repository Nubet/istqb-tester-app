import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Layers3, ChevronRight } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS, SHADOWS } from '@/constants/colors';
import { glossaryService } from '@/services';

const ALL_DECK_ID = '__all__';

export default function FlashcardsDecksScreen() {
    const router = useRouter();
    const { data: deckSummaries = [], isLoading, isError } = useQuery({
        queryKey: ['glossaryFlashcardDecks'],
        queryFn: () => glossaryService.getCategorySummaries(),
    });

    const totalCards = deckSummaries.reduce((sum, deck) => sum + deck.count, 0);

    return (
        <View style={styles.container}>
            <ScreenHeader title="Fiszki" showBack />

            <View style={styles.content}>
                <Text style={styles.intro}>Wybierz zestaw i ćwicz pojęcia </Text>

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
                        <TouchableOpacity
                            style={styles.deckCard}
                            activeOpacity={0.85}
                            onPress={() => router.push({ pathname: '/glossary/flashcards/session', params: { deck: ALL_DECK_ID } })}
                        >
                            <View style={styles.deckIconWrap}>
                                <Layers3 size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.deckTextWrap}>
                                <Text style={styles.deckTitle}>Wszystkie kategorie</Text>
                                <Text style={styles.deckMeta}>{totalCards} kart</Text>
                            </View>
                            <ChevronRight size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>

                        {deckSummaries.map((deck) => (
                            <TouchableOpacity
                                key={deck.category}
                                style={styles.deckCard}
                                activeOpacity={0.85}
                                onPress={() => router.push({ pathname: '/glossary/flashcards/session', params: { deck: deck.category } })}
                            >
                                <View style={styles.deckIconWrap}>
                                    <Layers3 size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.deckTextWrap}>
                                    <Text style={styles.deckTitle}>{deck.category}</Text>
                                    <Text style={styles.deckMeta}>{deck.count} kart</Text>
                                </View>
                                <ChevronRight size={20} color={COLORS.textMuted} />
                            </TouchableOpacity>
                        ))}
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
        padding: 24,
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
        gap: 12,
        paddingBottom: 24,
    },
    deckCard: {
        backgroundColor: COLORS.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.soft,
    },
    deckIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    deckTextWrap: {
        flex: 1,
        marginRight: 8,
    },
    deckTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    deckMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
});
