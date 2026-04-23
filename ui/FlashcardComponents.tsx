import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    PanResponder,
} from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/colors';
import type { GlossaryTerm } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type FlashcardCardProps = {
    card: GlossaryTerm;
    isFlipped: boolean;
    frontMode: 'term' | 'definition' | 'both';
    onFlip: () => void;
};

export function FlashcardCard({
    card,
    isFlipped,
    frontMode,
    onFlip,
}: FlashcardCardProps) {
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 1 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, [isFlipped, flipAnim]);

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
                        <View style={styles.termSection}>
                            <Text style={styles.sideLabel}>POJĘCIE</Text>
                            <Text style={styles.cardText}>{card.term}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.defSection}>
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
                        <View style={styles.termSection}>
                            <Text style={styles.sideLabel}>POJĘCIE</Text>
                            <Text style={styles.cardText}>{card.term}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.defSection}>
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

type FlashcardSwiperProps = {
    card: GlossaryTerm;
    frontMode: 'term' | 'definition' | 'both';
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
};

export function FlashcardSwiper({
    card,
    frontMode,
    onSwipeLeft,
    onSwipeRight,
}: FlashcardSwiperProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                Animated.timing(pan, {
                    toValue: { x: SCREEN_WIDTH * 1.5, y: gesture.dy },
                    duration: 200,
                    useNativeDriver: false,
                }).start(onSwipeRight);
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                Animated.timing(pan, {
                    toValue: { x: -SCREEN_WIDTH * 1.5, y: gesture.dy },
                    duration: 200,
                    useNativeDriver: false,
                }).start(onSwipeLeft);
            } else {
                if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
                    setIsFlipped(!isFlipped);
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            }
        },
    }), [pan, isFlipped, onSwipeLeft, onSwipeRight]);

    const rotate = pan.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
    });

    const likeOpacity = pan.x.interpolate({
        inputRange: [0, SWIPE_THRESHOLD / 2],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const dislikeOpacity = pan.x.interpolate({
        inputRange: [-SWIPE_THRESHOLD / 2, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const borderColor = pan.x.interpolate({
        inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
        outputRange: [COLORS.danger, 'transparent', COLORS.success],
        extrapolate: 'clamp',
    });

    const animatedStyle = {
        transform: [...pan.getTranslateTransform(), { rotate }],
    };

    return (
        <View style={styles.swiperContainer}>
            <Animated.View
                style={[styles.animatedCard, animatedStyle]}
                {...panResponder.panHandlers}
            >
                <Animated.View style={[styles.cardBorderOverlay, { borderColor, borderWidth: 3 }]} pointerEvents="none" />
                
                <Animated.View style={[styles.swipeLabel, styles.swipeLabelRight, { opacity: likeOpacity }]}>
                    <Text style={[styles.swipeLabelText, { color: COLORS.success }]}>UMIEM</Text>
                </Animated.View>

                <Animated.View style={[styles.swipeLabel, styles.swipeLabelLeft, { opacity: dislikeOpacity }]}>
                    <Text style={[styles.swipeLabelText, { color: COLORS.danger }]}>UCZĘ SIĘ</Text>
                </Animated.View>

                <FlashcardCard
                    card={card}
                    isFlipped={isFlipped}
                    frontMode={frontMode}
                    onFlip={() => setIsFlipped(!isFlipped)}
                />
            </Animated.View>
        </View>
    );
}

type FlashcardHeaderCountersProps = {
    known: number;
    learning: number;
};

export function FlashcardHeaderCounters({ known, learning }: FlashcardHeaderCountersProps) {
    const prevKnown = useRef(known);
    const prevLearning = useRef(learning);
    const knownAnim = useRef(new Animated.Value(0)).current;
    const learningAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (known > prevKnown.current) {
            Animated.sequence([
                Animated.timing(knownAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(knownAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]).start();
        }
        prevKnown.current = known;
    }, [known]);

    useEffect(() => {
        if (learning > prevLearning.current) {
            Animated.sequence([
                Animated.timing(learningAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(learningAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]).start();
        }
        prevLearning.current = learning;
    }, [learning]);

    const knownTranslateY = knownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const learningTranslateY = learningAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

return (
    <View style={styles.headerCounters}>
      <View style={[styles.counterGroup, styles.counterGroupLearning]}>
        <View style={[styles.counterPill, { borderColor: COLORS.danger }]}>
          <Text style={[styles.counterValue, { color: COLORS.danger }]}>{learning}</Text>
        </View>
        <Animated.Text style={[styles.plusOne, styles.plusOneLearning, { color: COLORS.danger, opacity: learningAnim, transform: [{ translateY: learningTranslateY }] }]}>
          +1
        </Animated.Text>
      </View>

      <View style={styles.counterGroup}>
        <Animated.Text style={[styles.plusOne, { color: COLORS.success, opacity: knownAnim, transform: [{ translateY: knownTranslateY }] }]}>
          +1
        </Animated.Text>
        <View style={[styles.counterPill, { borderColor: COLORS.success }]}>
          <Text style={[styles.counterValue, { color: COLORS.success }]}>{known}</Text>
        </View>
      </View>
    </View>
  );
}

export function FlashcardProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>{current} / {total}</Text>
        </View>
    );
}

export function FlashcardComplete({ total, onRestart, onExit }: { total: number; onRestart: () => void; onExit: () => void }) {
    return (
        <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>Zestaw opanowany!</Text>
            <Text style={styles.completeSubtitle}>Wszystkie {total} fiszek w sekcji „Umiem”</Text>
            <View style={styles.completeActions}>
                <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
                    <Text style={styles.restartText}>Powtórz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitButton} onPress={onExit}>
                    <Text style={styles.exitText}>Wybierz inny zestaw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    swiperContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animatedCard: {
        width: SCREEN_WIDTH * 0.85,
        height: SCREEN_WIDTH * 1.2,
        borderRadius: RADIUS.lg,
        ...SHADOWS.soft,
    },
    cardBorderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: RADIUS.lg,
        zIndex: 10,
    },
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
    termSection: {
        flex: 1,
        justifyContent: 'center',
    },
    defSection: {
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
    swipeLabel: {
        position: 'absolute',
        top: 40,
        zIndex: 20,
        borderWidth: 3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    swipeLabelRight: {
        left: 20,
        borderColor: COLORS.success,
        transform: [{ rotate: '-15deg' }],
    },
    swipeLabelLeft: {
        right: 20,
        borderColor: COLORS.danger,
        transform: [{ rotate: '15deg' }],
    },
    swipeLabelText: {
        fontSize: 24,
        fontWeight: '900',
    },
    headerCounters: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: 8,
        height: 40,
        alignItems: 'center',
    },
counterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterGroupLearning: {
    position: 'relative',
  },
  plusOneLearning: {
    position: 'absolute',
    left: '100%',
    marginLeft: 8,
  },
    counterPill: {
        minWidth: 42,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '800',
    },
    plusOne: {
        fontSize: 16,
        fontWeight: '800',
    },
    progressTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    completeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    completeEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    completeTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    completeSubtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 32,
    },
    completeActions: {
        width: '100%',
        gap: 16,
    },
    restartButton: {
        backgroundColor: COLORS.card,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingVertical: 16,
        alignItems: 'center',
    },
    restartText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    exitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.md,
        paddingVertical: 16,
        alignItems: 'center',
    },
    exitText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
    },
});