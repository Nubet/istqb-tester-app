import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS } from '@/constants/colors';

export function FlashcardProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
                {current} / {total}
            </Text>
        </View>
    );
}

export function FlashcardComplete({ total, onRestart, onExit }: { total: number; onRestart: () => void; onExit: () => void }) {
    return (
        <View style={styles.completeContainer}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>Zestaw opanowany!</Text>
            <Text style={styles.completeSubtitle}>Wszystkie {total} fiszek w sekcji &quot;Umiem&quot;</Text>
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
