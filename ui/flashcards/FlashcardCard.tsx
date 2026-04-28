import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS } from '@/constants/colors';
import type { FlashcardFrontMode } from '@/constants/flashcards';
import type { GlossaryTerm } from '@/types';

type FlashcardCardProps = {
    card: GlossaryTerm;
    isFlipped: boolean;
    frontMode: FlashcardFrontMode;
};

export function FlashcardCard({ card, isFlipped, frontMode }: FlashcardCardProps) {
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 1 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [flipAnim, isFlipped]);

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    const backOpacity = flipAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const showBoth = frontMode === 'both';

    return (
        <View style={styles.cardContainer}>
            <Animated.View style={[styles.cardFace, styles.cardFront, { opacity: frontOpacity, transform: [{ rotateY: frontInterpolate }] }]}>
                {showBoth ? (
                    <View style={styles.bothContent}>
                        <View style={styles.section}>
                            <Text style={styles.sideLabel}>POJĘCIE</Text>
                            <Text style={styles.cardText}>{card.term}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sideLabel}>DEFINICJA</Text>
                            <Text style={styles.cardTextSecondary}>{card.definition}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.singleContent}>
                        <Text style={styles.cardText}>
                            {frontMode === 'term' ? card.term : card.definition}
                        </Text>
                    </View>
                )}
            </Animated.View>

            <Animated.View style={[styles.cardFace, styles.cardBack, { opacity: backOpacity, transform: [{ rotateY: backInterpolate }] }]}>
                {showBoth ? (
                    <View style={styles.bothContent}>
                        <View style={styles.section}>
                            <Text style={styles.sideLabel}>POJĘCIE</Text>
                            <Text style={styles.cardText}>{card.term}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.section}>
                            <Text style={styles.sideLabel}>DEFINICJA</Text>
                            <Text style={styles.cardTextSecondary}>{card.definition}</Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.singleContent}>
                        <Text style={styles.cardText}>
                            {frontMode === 'term' ? card.definition : card.term}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.card,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFront: {
        zIndex: 2,
    },
    cardBack: {
        zIndex: 1,
    },
    singleContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bothContent: {
        flex: 1,
        width: '100%',
    },
    section: {
        flex: 1,
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 16,
    },
    sideLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
        letterSpacing: 1,
        marginBottom: 8,
        textAlign: 'center',
    },
    cardText: {
        fontSize: 26,
        lineHeight: 34,
        fontWeight: '700',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    cardTextSecondary: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: COLORS.textMuted,
        textAlign: 'center',
    },
});
