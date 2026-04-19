import { useMemo } from 'react';
import { PanResponder } from 'react-native';

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
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
                    Math.abs(gestureState.dx) > activationThreshold,
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dx < -triggerThreshold) {
                        onSwipeLeft();
                        return;
                    }

                    if (gestureState.dx > triggerThreshold) {
                        onSwipeRight();
                    }
                },
            }),
        [activationThreshold, onSwipeLeft, onSwipeRight, triggerThreshold]
    );

    return panResponder.panHandlers;
}
