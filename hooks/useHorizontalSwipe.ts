import { useMemo, useRef } from 'react';
import { PanResponder, Animated } from 'react-native';

type UseHorizontalSwipeParams = {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    activationThreshold?: number;
    triggerThreshold?: number;
};

export function useHorizontalSwipe({
    onSwipeLeft,
    onSwipeRight,
    activationThreshold = 18,
    triggerThreshold = 55,
}: UseHorizontalSwipeParams) {
    const pan = useRef(new Animated.Value(0)).current;

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
                    Math.abs(gestureState.dx) > activationThreshold,
                onPanResponderMove: Animated.event([null, { dx: pan }], {
                    useNativeDriver: false,
                }),
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dx < -triggerThreshold) {
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
        [activationThreshold, onSwipeLeft, onSwipeRight, triggerThreshold, pan]
    );

    return { panHandlers: panResponder.panHandlers, pan };
}
