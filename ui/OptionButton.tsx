import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import type { AnswerId } from '../types';

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
                    {
                        backgroundColor: getLetterBackgroundColor(),
                        color: getLetterColor(),
                    },
                ]}
            >
                {option}
            </Text>
            <Text style={styles.text}>{text}</Text>
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
