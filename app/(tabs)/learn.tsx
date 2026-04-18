import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { useLearningSession } from '../../hooks/useLearningSession';
import { OptionButton } from '../../ui/OptionButton';

export default function LearnScreen() {
    const router = useRouter();
    const {
        sections,
        selectedSection,
        isSectionSelection,
        currentQuestion,
        currentIndex,
        totalQuestions,
        selectedAnswer,
        hasAnswered,
        isCorrect,
        startSection,
        backToSections,
        answerQuestion,
        nextQuestion,
        isLoadingSections,
        isStartingSection,
    } = useLearningSession();

    if (isSectionSelection) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header} edges={['top']}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={20} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tryb nauki</Text>
                    <View style={styles.placeholder} />
                </SafeAreaView>

                <View style={styles.content}>
                    <Text style={styles.sectionIntro}>Wybierz sekcję, z której chcesz ćwiczyć pytania.</Text>

                    {isLoadingSections ? (
                        <View style={styles.center}>
                            <Text style={styles.loading}>Ładowanie sekcji...</Text>
                        </View>
                    ) : (
                        <View style={styles.options}>
                            {sections.map((section) => (
                                <TouchableOpacity
                                    key={section}
                                    style={styles.sectionButton}
                                    onPress={() => startSection(section)}
                                    disabled={isStartingSection}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.sectionTitle}>{section}</Text>
                                    <Text style={styles.sectionMeta}>Rozpocznij pytania z tej sekcji</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        );
    }

    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.header} edges={['top']}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={20} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tryb nauki</Text>
                    <View style={styles.placeholder} />
                </SafeAreaView>
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie pytań...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={20} color={COLORS.card} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedSection || 'Tryb nauki'}</Text>
                <TouchableOpacity onPress={backToSections} style={styles.iconBtn}>
                    <RotateCcw size={20} color={COLORS.card} />
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.content}>
                <Text style={styles.questionMeta}>Mikro-sesja {currentIndex + 1}/{totalQuestions}</Text>

                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.text}</Text>
                </View>

                <View style={styles.options}>
                    {(['A', 'B', 'C', 'D'] as const).map((option) => (
                        <OptionButton
                            key={option}
                            option={option}
                            text={currentQuestion.options[option]}
                            selected={selectedAnswer === option}
                            correct={hasAnswered && option === currentQuestion.correctAnswer}
                            wrong={hasAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer}
                            disabled={hasAnswered}
                            onPress={() => answerQuestion(option)}
                        />
                    ))}
                </View>

                {hasAnswered && (
                    <View style={[styles.feedback, { borderTopColor: isCorrect ? COLORS.success : COLORS.danger }]}>
                        <Text style={[styles.feedbackTitle, { color: isCorrect ? COLORS.success : COLORS.danger }]}>
                            {isCorrect ? 'Poprawna odpowiedź!' : 'Niepoprawna odpowiedź'}
                        </Text>
                        <Text style={styles.feedbackText}>{currentQuestion.explanation}</Text>
                    </View>
                )}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.ghostBtn} onPress={nextQuestion}>
                    <Text style={styles.ghostText}>Pomiń</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaBtn} onPress={nextQuestion}>
                    <Text style={styles.ctaText}>Dalej</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.card,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        fontSize: 16,
        color: COLORS.textMuted,
    },
    questionMeta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
    },
    sectionIntro: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    sectionButton: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    sectionMeta: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    questionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    questionText: {
        fontSize: 19,
        lineHeight: 26,
        fontWeight: '700',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    options: {
        gap: 12,
    },
    feedback: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        marginTop: 16,
        borderTopWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 6,
    },
    feedbackText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    controls: {
        flexDirection: 'row',
        gap: 16,
        padding: 24,
    },
    ghostBtn: {
        flex: 1,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 100,
        padding: 16,
        alignItems: 'center',
        backgroundColor: COLORS.card,
    },
    ghostText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    ctaBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 100,
        padding: 16,
        alignItems: 'center',
    },
    ctaText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
    },
});
