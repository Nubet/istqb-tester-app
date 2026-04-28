import { useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '@/constants/colors';
import type { FlashcardFrontMode } from '@/constants/flashcards';
import type { GlossaryTerm } from '@/types';
import { FlashcardCard } from './FlashcardCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type FlashcardSwiperProps = {
    card: GlossaryTerm;
    frontMode: FlashcardFrontMode;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
};

export function FlashcardSwiper({ card, frontMode, onSwipeLeft, onSwipeRight }: FlashcardSwiperProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
                onPanResponderRelease: (_, gesture) => {
                    if (gesture.dx > SWIPE_THRESHOLD) {
                        Animated.timing(pan, {
                            toValue: { x: SCREEN_WIDTH * 1.5, y: gesture.dy },
                            duration: 200,
                            useNativeDriver: false,
                        }).start(() => {
                            setIsFlipped(false);
                            onSwipeRight();
                            pan.setValue({ x: 0, y: 0 });
                        });
                        return;
                    }

                    if (gesture.dx < -SWIPE_THRESHOLD) {
                        Animated.timing(pan, {
                            toValue: { x: -SCREEN_WIDTH * 1.5, y: gesture.dy },
                            duration: 200,
                            useNativeDriver: false,
                        }).start(() => {
                            setIsFlipped(false);
                            onSwipeLeft();
                            pan.setValue({ x: 0, y: 0 });
                        });
                        return;
                    }

                    if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
                        setIsFlipped((value) => !value);
                    }

                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                },
            }),
        [onSwipeLeft, onSwipeRight, pan]
    );

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
            <Animated.View style={[styles.animatedCard, animatedStyle]} {...panResponder.panHandlers}>
                <Animated.View style={[styles.cardBorderOverlay, { borderColor, borderWidth: 3 }]} pointerEvents="none" />

                <Animated.View style={[styles.swipeLabel, styles.swipeLabelRight, { opacity: likeOpacity }]}>
                    <Text style={[styles.swipeLabelText, { color: COLORS.success }]}>UMIEM</Text>
                </Animated.View>

                <Animated.View style={[styles.swipeLabel, styles.swipeLabelLeft, { opacity: dislikeOpacity }]}>
                    <Text style={[styles.swipeLabelText, { color: COLORS.danger }]}>UCZĘ SIĘ</Text>
                </Animated.View>

                <FlashcardCard card={card} isFlipped={isFlipped} frontMode={frontMode} />
            </Animated.View>
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
});
