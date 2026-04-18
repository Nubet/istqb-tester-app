import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export function ProgressRing({
                                  percentage,
                                  size = 60,
                                  strokeWidth = 6
                              }: ProgressRingProps) {
    const ringFill = Math.max(0, Math.min(100, percentage));

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[styles.background, { width: size, height: size, borderRadius: size / 2 }]} />
            <View
                style={[
                    styles.progress,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: COLORS.accent,
                        opacity: ringFill / 100,
                    }
                ]}
            />
            <View style={[styles.inner, { width: size - strokeWidth * 2, height: size - strokeWidth * 2, borderRadius: (size - strokeWidth * 2) / 2 }]}>
                <Text style={styles.text}>{percentage}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        backgroundColor: COLORS.background,
    },
    progress: {
        position: 'absolute',
    },
    inner: {
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.textMain,
    },
});
