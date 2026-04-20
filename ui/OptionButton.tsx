import { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { scaleValue } from '@/constants/readingDensity';
import { useReadingPreferences } from '@/hooks/useReadingPreferences';
import type { AnswerId } from '@/types';

interface OptionButtonProps {
    option: AnswerId;
    text: string;
    selected?: boolean;
    correct?: boolean;
    wrong?: boolean;
    disabled?: boolean;
    onPress: () => void;
}

export function OptionButton({
                                 option,
                                 text,
                                 selected = false,
                                 correct = false,
                                 wrong = false,
                                 disabled = false,
                              onPress,
                              }: OptionButtonProps) {
    const { density } = useReadingPreferences();

    const dynamicStyles = useMemo(() => ({
        container: {
            padding: scaleValue(16, density.answerSpacingScale, 10),
            gap: scaleValue(16, density.answerSpacingScale, 8),
            minHeight: density.optionMinHeight,
        },
        letter: {
            width: scaleValue(32, density.answerSpacingScale, 26),
            height: scaleValue(32, density.answerSpacingScale, 26),
            borderRadius: scaleValue(16, density.answerSpacingScale, 13),
            lineHeight: scaleValue(32, density.answerSpacingScale, 26),
            fontSize: scaleValue(14, density.answerTextScale, 12),
        },
        text: {
            fontSize: scaleValue(15, density.answerTextScale, 12),
            lineHeight: scaleValue(20, density.answerTextScale, 16),
        },
    }), [density.answerSpacingScale, density.answerTextScale, density.optionMinHeight]);

    const getBackgroundColor = () => {
        if (correct) return COLORS.successSoft;
        if (wrong) return COLORS.dangerSoft;
        if (selected) return COLORS.primarySoft;
        return COLORS.card;
    };

    const getBorderColor = () => {
        if (correct) return COLORS.success;
        if (wrong) return COLORS.danger;
        if (selected) return COLORS.primary;
        return COLORS.card;
    };

    const getLetterBackgroundColor = () => {
        if (correct) return COLORS.success;
        if (wrong) return COLORS.danger;
        if (selected) return COLORS.primary;
        return COLORS.background;
    };

    const getLetterColor = () => {
        if (correct || wrong || selected) return COLORS.card;
        return COLORS.textMuted;
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                dynamicStyles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Text
                style={[
                    styles.letter,
                    dynamicStyles.letter,
                    {
                        backgroundColor: getLetterBackgroundColor(),
                        color: getLetterColor(),
                    },
                ]}
            >
                {option}
            </Text>
            <Text style={[styles.text, dynamicStyles.text]}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        padding: 16,
        borderWidth: 2,
        gap: 16,
    },
    letter: {
        width: 32,
        height: 32,
        borderRadius: 16,
        textAlign: 'center',
        lineHeight: 32,
        fontSize: 14,
        fontWeight: '800',
    },
    text: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textMain,
        lineHeight: 20,
    },
});
