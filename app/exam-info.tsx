import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, BookOpen, Target, Info } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function ExamInfoScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={20} color={COLORS.card} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Egzamin próbny</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>CTFL v4.0.1</Text>
                    <Text style={styles.meta}>Symulacja realnego egzaminu</Text>
                </View>

                <View style={styles.infoList}>
                    <View style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Clock size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoTitle}>60 minut</Text>
                            <Text style={styles.meta}>Zegar odlicza bez zatrzymania.</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <BookOpen size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoTitle}>40 pytań wyboru</Text>
                            <Text style={styles.meta}>W pełni zgodne z egzaminem ISTQB.</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.iconContainer}>
                            <Target size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoTitle}>Próg: 65% (26/40)</Text>
                            <Text style={styles.meta}>Bez punktów ujemnych.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.warning}>
                    <Info size={18} color="#a87e40" style={styles.warningIcon} />
                    <Text style={styles.warningText}>
                        W trybie egzaminu nie pokazujemy podpowiedzi i uzasadnień po zaznaczeniu odpowiedzi. Wynik zobaczysz na końcu.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.cta} onPress={() => router.push('/exam-run')}>
                    <Text style={styles.ctaText}>Rozpocznij teraz</Text>
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
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    warningIcon: {
        marginTop: 2,
    },
    warningText: {
        flex: 1,
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
        alignItems: 'center',
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
