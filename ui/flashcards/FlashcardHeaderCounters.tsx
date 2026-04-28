import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

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
    }, [known, knownAnim]);

    useEffect(() => {
        if (learning > prevLearning.current) {
            Animated.sequence([
                Animated.timing(learningAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(learningAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]).start();
        }
        prevLearning.current = learning;
    }, [learning, learningAnim]);

    const knownTranslateY = knownAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const learningTranslateY = learningAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerCounters}>
                <View style={[styles.counterGroup, styles.counterGroupLearning]}>
                    <View style={[styles.counterPill, { borderColor: COLORS.danger }]}>
                        <Text style={[styles.counterValue, { color: COLORS.danger }]}>{learning}</Text>
                    </View>
                    <Animated.Text
                        style={[
                            styles.plusOne,
                            styles.plusOneLearning,
                            { color: COLORS.danger, opacity: learningAnim, transform: [{ translateY: learningTranslateY }] },
                        ]}
                    >
                        +1
                    </Animated.Text>
                </View>

                <View style={styles.counterGroup}>
                    <Animated.Text
                        style={[styles.plusOne, { color: COLORS.success, opacity: knownAnim, transform: [{ translateY: knownTranslateY }] }]}
                    >
                        +1
                    </Animated.Text>
                    <View style={[styles.counterPill, { borderColor: COLORS.success }]}>
                        <Text style={[styles.counterValue, { color: COLORS.success }]}>{known}</Text>
                    </View>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 8,
        paddingHorizontal: 24,
    },
    headerCounters: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});
