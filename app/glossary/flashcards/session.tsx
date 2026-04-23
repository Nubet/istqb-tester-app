import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Settings, X } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { glossaryService } from '@/services';
import { useFlashcardPreferences } from '@/hooks/useFlashcardPreferences';
import { FLASHCARD_FRONT_OPTIONS, FLASHCARD_ORDER_OPTIONS } from '@/constants/flashcards';
import { useFlashcardsSession } from '@/hooks/useFlashcardsSession';
import {
    FlashcardSwiper,
    FlashcardHeaderCounters,
    FlashcardProgressBar,
    FlashcardComplete,
} from '@/ui/FlashcardComponents';

const ALL_DECK_ID = '__all__';

export default function FlashcardsSessionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ deck?: string }>();
    const [showSettings, setShowSettings] = useState(false);

    const deck = typeof params.deck === 'string' ? params.deck : ALL_DECK_ID;
    const isAllDeck = deck === ALL_DECK_ID;

    const { preferences, setOrderMode, setFrontMode } = useFlashcardPreferences();

    const {
        data: cards = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['flashcardDeckTerms', deck],
        queryFn: () => (isAllDeck ? glossaryService.getAllTerms() : glossaryService.getTermsByCategory(deck)),
    });

    const {
        totalCards,
        currentCard,
        currentCardPosition,
        knownCount,
        learningCount,
        isComplete,
        markKnown,
        markLearning,
        resetSession,
    } = useFlashcardsSession({ cards, orderMode: preferences.orderMode });

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Fiszki" showBack />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.infoText}>Ładowanie fiszek...</Text>
                </View>
            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Fiszki" showBack />
                <View style={styles.center}>
                    <Text style={styles.infoText}>Nie udało się załadować zestawu.</Text>
                </View>
            </View>
        );
    }

    if (cards.length === 0) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Fiszki" showBack />
                <View style={styles.center}>
                    <Text style={styles.infoText}>Ten zestaw nie ma fiszek.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title=""
                leftAction={
                    <TouchableOpacity
                        style={styles.headerBtn}
                        onPress={() => router.back()}
                    >
                        <X size={20} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                centerAction={
                    <FlashcardProgressBar
                        current={currentCardPosition}
                        total={totalCards}
                    />
                }
                rightActions={
                    <TouchableOpacity
                        style={styles.headerBtn}
                        onPress={() => setShowSettings(true)}
                    >
                        <Settings size={20} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                style={styles.header}
            />

            <FlashcardHeaderCounters
                known={knownCount}
                learning={learningCount}
            />

            <View style={styles.content}>
                {isComplete ? (
                    <FlashcardComplete
                        total={totalCards}
                        onRestart={resetSession}
                        onExit={() => router.back()}
                    />
                ) : (
                    currentCard && (
                        <FlashcardSwiper
                            key={currentCard.id}
                            card={currentCard}
                            frontMode={preferences.frontMode}
                            onSwipeLeft={markLearning}
                            onSwipeRight={markKnown}
                        />
                    )
                )}
            </View>

            <Modal
                visible={showSettings}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSettings(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowSettings(false)}
                >
                    <Pressable
                        style={styles.modalCard}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>Personalizacja</Text>

                        <Text style={styles.modalSectionLabel}>Kolejność</Text>
                        <View style={styles.optionWrap}>
                            {FLASHCARD_ORDER_OPTIONS.map((option) => {
                                const active = preferences.orderMode === option.mode;
                                return (
                                    <TouchableOpacity
                                        key={option.mode}
                                        style={[
                                            styles.optionChip,
                                            active && styles.optionChipActive,
                                        ]}
                                        onPress={() => setOrderMode(option.mode)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionChipText,
                                                active && styles.optionChipTextActive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <Text style={styles.modalSectionLabel}>Strona startowa</Text>
                        <View style={styles.optionWrap}>
                            {FLASHCARD_FRONT_OPTIONS.map((option) => {
                                const active = preferences.frontMode === option.mode;
                                return (
                                    <TouchableOpacity
                                        key={option.mode}
                                        style={[
                                            styles.optionChip,
                                            active && styles.optionChipActive,
                                        ]}
                                        onPress={() => setFrontMode(option.mode)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionChipText,
                                                active && styles.optionChipTextActive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={styles.closeModalBtn}
                            onPress={() => setShowSettings(false)}
                        >
                            <Text style={styles.closeModalBtnText}>Gotowe</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: 'transparent',
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    content: {
        flex: 1,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 18,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 10,
    },
    modalSectionLabel: {
        marginTop: 8,
        marginBottom: 8,
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textMuted,
    },
    optionWrap: {
        gap: 8,
    },
    optionChip: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        minHeight: 40,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    optionChipActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primarySoft,
    },
    optionChipText: {
        fontSize: 13,
        color: COLORS.textMain,
        fontWeight: '700',
    },
    optionChipTextActive: {
        color: COLORS.primaryDark,
    },
    closeModalBtn: {
        marginTop: 14,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minHeight: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeModalBtnText: {
        color: COLORS.card,
        fontSize: 14,
        fontWeight: '800',
    },
});