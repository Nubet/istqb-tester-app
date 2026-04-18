import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Clock, Star, Flag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { COLORS } from '@/constants/colors';
import { useExam } from '@/hooks/useExam';
import { OptionButton } from '@/ui/OptionButton';

export default function ExamRunScreen() {
    const router = useRouter();
    const {
        currentQuestion,
        currentIndex,
        totalQuestions,
        timeRemaining,
        selectedAnswer,
        isBookmarked,
        answerQuestion,
        toggleBookmark,
        finishExam,
    } = useExam();

    const [timer, setTimer] = useState('59:59');

    useEffect(() => {
        if (timeRemaining > 0) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    }, [timeRemaining]);

    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.loading}>Ładowanie egzaminu...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <X size={20} color={COLORS.card} />
                </TouchableOpacity>

                <View style={styles.timer}>
                    <Clock size={16} color={COLORS.card} />
                    <Text style={styles.timerText}>{timer}</Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={[styles.iconBtn, isBookmarked && styles.iconBtnActive]}
                        onPress={toggleBookmark}
                    >
                        <Star size={20} color={isBookmarked ? COLORS.warning : COLORS.card} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={finishExam}>
                        <Flag size={20} color={COLORS.card} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <View style={styles.content}>
                <Text style={styles.questionMeta}>
                    Pytanie {currentIndex + 1}/{totalQuestions}
                </Text>

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
                            onPress={() => answerQuestion(option)}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.ghostBtn} onPress={() => {}}>
                    <Text style={styles.ghostText}>Wyczyść</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaBtn} onPress={finishExam}>
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
    iconBtnActive: {
        backgroundColor: COLORS.card,
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 100,
    },
    timerText: {
        color: COLORS.card,
        fontSize: 15,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
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
