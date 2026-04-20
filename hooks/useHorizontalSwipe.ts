import { useMemo, useRef } from 'react';
import { PanResponder, Animated } from 'react-native';

type UseHorizontalSwipeParams = {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    canSwipeLeft?: boolean;
    canSwipeRight?: boolean;
    activationThreshold?: number;
    triggerThreshold?: number;
};

export function useHorizontalSwipe({
    onSwipeLeft,
    onSwipeRight,
    canSwipeLeft = true,
    canSwipeRight = true,
    activationThreshold = 18,
    triggerThreshold = 55,
}: UseHorizontalSwipeParams) {
    const pan = useRef(new Animated.Value(0)).current;
    const dominanceRatio = 1.35;
    const maxOffAxisDistance = 22;

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > activationThreshold &&
                    Math.abs(gestureState.dy) < maxOffAxisDistance &&
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * dominanceRatio,
                onPanResponderMove: (_, gestureState) => {
                    if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 0.9) {
                        return;
                    }

                    if (gestureState.dx < 0 && !canSwipeLeft) {
                        pan.setValue(-Math.min(Math.abs(gestureState.dx) * 0.18, 18));
                        return;
                    }

                    if (gestureState.dx > 0 && !canSwipeRight) {
                        pan.setValue(Math.min(Math.abs(gestureState.dx) * 0.18, 18));
                        return;
                    }

                    pan.setValue(gestureState.dx);
                },
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dx < -triggerThreshold) {
                        if (!canSwipeLeft) {
                            Animated.spring(pan, {
                                toValue: 0,
                                speed: 28,
                                bounciness: 0,
                                useNativeDriver: true,
                            }).start();
                            return;
                        }

                        Animated.timing(pan, {
                            toValue: -400,
                            duration: 150,
                            useNativeDriver: true,
                        }).start(() => {
                            onSwipeLeft();
                            pan.setValue(400);
                            Animated.spring(pan, {
                                toValue: 0,
                                speed: 20,
                                bounciness: 4,
                                useNativeDriver: true,
                            }).start();
                        });
                        return;
                    }

                    if (gestureState.dx > triggerThreshold) {
                        if (!canSwipeRight) {
                            Animated.spring(pan, {
                                toValue: 0,
                                speed: 28,
                                bounciness: 0,
                                useNativeDriver: true,
                            }).start();
                            return;
                        }

                        Animated.timing(pan, {
                            toValue: 400,
                            duration: 150,
                            useNativeDriver: true,
                        }).start(() => {
                            onSwipeRight();
                            pan.setValue(-400);
                            Animated.spring(pan, {
                                toValue: 0,
                                speed: 20,
                                bounciness: 4,
                                useNativeDriver: true,
                            }).start();
                        });
                        return;
                    }

                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                },
            }),
        [
            activationThreshold,
            canSwipeLeft,
            canSwipeRight,
            dominanceRatio,
            maxOffAxisDistance,
            onSwipeLeft,
            onSwipeRight,
            triggerThreshold,
            pan,
        ]
    );

    return { panHandlers: panResponder.panHandlers, pan };
}
