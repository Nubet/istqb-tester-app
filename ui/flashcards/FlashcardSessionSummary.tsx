import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, RADIUS, SHADOWS } from '@/constants/colors';

type FlashcardSessionSummaryProps = {
    total: number;
    known: number;
    learning: number;
    onContinue: () => void;
    onResetDeck: () => void;
    canContinueLearning: boolean;
};

const CHART_SIZE = 140;
const CHART_STROKE = 14;
const CHART_RADIUS = (CHART_SIZE - CHART_STROKE) / 2;
const CHART_CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

export function FlashcardSessionSummary({
    total,
    known,
    learning,
    onContinue,
    onResetDeck,
    canContinueLearning,
}: FlashcardSessionSummaryProps) {
    const safeTotal = Math.max(1, total);
    const knownRatio = known / safeTotal;
    const knownPercent = Math.round(knownRatio * 100);
    const knownArc = CHART_CIRCUMFERENCE * knownRatio;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>Gratulacje, dobra robota. Kończysz tę rundę fiszek.</Text>
            <Text style={styles.title}>Twój postęp</Text>

            <View style={styles.progressCard}>
                <View style={styles.chartAndStatsContainer}>
                    <View style={styles.chartWrap}>
                        <Svg width={CHART_SIZE} height={CHART_SIZE}>
                            <Circle
                                cx={CHART_SIZE / 2}
                                cy={CHART_SIZE / 2}
                                r={CHART_RADIUS}
                                stroke={COLORS.warning}
                                strokeWidth={CHART_STROKE}
                                fill="none"
                                strokeLinecap="butt"
                            />
                            <Circle
                                cx={CHART_SIZE / 2}
                                cy={CHART_SIZE / 2}
                                r={CHART_RADIUS}
                                stroke={COLORS.success}
                                strokeWidth={CHART_STROKE}
                                fill="none"
                                strokeLinecap="butt"
                                rotation={-90}
                                originX={CHART_SIZE / 2}
                                originY={CHART_SIZE / 2}
                                strokeDasharray={`${knownArc} ${CHART_CIRCUMFERENCE}`}
                            />
                        </Svg>
                        <View style={styles.chartCenter}>
                            <Text style={styles.percentText}>{knownPercent}%</Text>
                        </View>
                    </View>

                    <View style={styles.legendWrap}>
                        <View style={[styles.legendCard, styles.legendKnown]}>
                            <Text style={styles.legendLabel}>Umiem</Text>
                            <Text style={styles.legendValue}>{known}</Text>
                        </View>

                        <View style={[styles.legendCard, styles.legendLearning]}>
                            <Text style={styles.legendLabel}>Wciąż się uczę</Text>
                            <Text style={styles.legendValue}>{learning}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                <Text style={styles.continueButtonText}>
                    {canContinueLearning ? 'Kontynuuj z pulą do nauki' : 'Wróć do zestawów'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onResetDeck} hitSlop={8}>
                <Text style={styles.resetText}>Resetuj zestaw</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 28,
        justifyContent: 'center',
        flexGrow: 1,
    },
    eyebrow: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.textMain,
        textAlign: 'center',
        marginBottom: 24,
    },
    progressCard: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
        ...SHADOWS.soft,
    },
    chartAndStatsContainer: {
        gap: 24,
        alignItems: 'center',
    },
    chartWrap: {
        alignSelf: 'center',
        width: CHART_SIZE,
        height: CHART_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartCenter: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentText: {
        fontSize: 30,
        fontWeight: '900',
        color: COLORS.textMain,
        lineHeight: 34,
    },
    percentCaption: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textMuted,
    },
    legendWrap: {
        width: '100%',
        gap: 12,
        justifyContent: 'center',
    },
    legendCard: {
        width: '100%',
        minHeight: 74,
        borderRadius: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    legendKnown: {
        backgroundColor: COLORS.successSoft,
        borderWidth: 1,
        borderColor: COLORS.success,
    },
    legendLearning: {
        backgroundColor: COLORS.warningSoft,
        borderWidth: 1,
        borderColor: COLORS.warning,
    },
    legendLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    legendValue: {
        fontSize: 30,
        fontWeight: '900',
        color: COLORS.textMain,
        lineHeight: 34,
    },
    continueButton: {
        marginTop: 24,
        minHeight: 56,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        color: COLORS.card,
        fontSize: 16,
        fontWeight: '800',
    },
    resetText: {
        marginTop: 20,
        paddingBottom: 20,
        textAlign: 'center',
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});
