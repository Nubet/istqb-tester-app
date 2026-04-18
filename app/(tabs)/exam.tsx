import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Target, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

export default function ExamScreen() {
    const router = useRouter();

    const examInfo = [
        {
            icon: Clock,
            title: '60 minut',
            meta: 'Zegar odlicza bez zatrzymania.',
        },
        {
            icon: BookOpen,
            title: '40 pytań wyboru',
            meta: 'Symulacja rzeczywistego egzaminu.',
        },
        {
            icon: Target,
            title: 'Próg: 65% (26/40)',
            meta: 'Bez punktów ujemnych.',
        },
    ];

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <Text style={styles.headerTitle}>Egzamin próbny</Text>
            </SafeAreaView>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>CTFL v4.0.1</Text>
                    <Text style={styles.meta}>Symulacja realnego egzaminu</Text>
                </View>

                <View style={styles.infoList}>
                    {examInfo.map((item, index) => (
                        <View key={index} style={styles.infoItem}>
                            <View style={styles.iconContainer}>
                                <item.icon size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.infoTitle}>{item.title}</Text>
                                <Text style={styles.meta}>{item.meta}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.warning}>
                    <Text style={styles.warningText}>
                        W trybie egzaminu nie pokazujemy podpowiedzi i uzasadnień po zaznaczeniu odpowiedzi. Wynik zobaczysz na końcu.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cta}
                    onPress={() => router.push('/exam-run')}
                >
                    <Text style={styles.ctaText}>Rozpocznij teraz</Text>
                    <ArrowRight size={20} color={COLORS.card} />
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
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.card,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    card: {
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
    cardTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    meta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
        lineHeight: 18,
    },
    infoList: {
        gap: 14,
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    warning: {
        backgroundColor: COLORS.warningSoft,
        borderRadius: 24,
        padding: 16,
    },
    warningText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#a87e40',
        lineHeight: 18,
    },
    footer: {
        padding: 24,
    },
    cta: {
        backgroundColor: COLORS.primary,
        borderRadius: 100,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 4,
    },
    ctaText: {
        color: COLORS.card,
        fontSize: 16,
        fontWeight: '700',
    },
});
