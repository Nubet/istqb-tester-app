import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, BookOpen, Target, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';

const EXAM_SECTIONS = [
    { title: 'Podstawy testowania', count: 6 },
    { title: 'Testowanie w cyklu życia oprogramowania', count: 6 },
    { title: 'Testowanie statyczne', count: 3 },
    { title: 'Techniki testowania', count: 12 },
    { title: 'Zarządzanie testami', count: 8 },
    { title: 'Narzędzia wspomagające testowanie', count: 5 },
];

export default function ExamScreen() {
    const router = useRouter();
    const [isSectionsExpanded, setIsSectionsExpanded] = useState(false);

    const examInfo = [
        {
            icon: Clock,
            title: '60 minut',
            meta: 'Zegar odlicza bez zatrzymania.',
        },
        {
            icon: Target,
            title: 'Próg: 65% (26/40)',
            meta: 'Bez punktów ujemnych.',
        },
    ];

    return (
        <View style={styles.container}>
            <ScreenHeader title="Egzamin próbny" containerStyle={styles.header} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>{item.title}</Text>
                                <Text style={styles.meta}>{item.meta}</Text>
                            </View>
                        </View>
                    ))}
                    
                    <TouchableOpacity 
                        style={styles.infoItem} 
                        activeOpacity={0.7}
                        onPress={() => setIsSectionsExpanded(!isSectionsExpanded)}
                    >
                        <View style={styles.iconContainer}>
                            <BookOpen size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>40 pytań wyboru</Text>
                            <Text style={styles.meta}>Rozkład: 6 sekcji</Text>
                        </View>
                        <View style={styles.expandIcon}>
                            {isSectionsExpanded ? (
                                <ChevronUp size={20} color={COLORS.textMuted} />
                            ) : (
                                <ChevronDown size={20} color={COLORS.textMuted} />
                            )}
                        </View>
                    </TouchableOpacity>

                    {isSectionsExpanded && (
                        <View style={styles.sectionsList}>
                            {EXAM_SECTIONS.map((section, index) => (
                                <View key={index} style={styles.sectionRow}>
                                    <View style={styles.sectionNumberContainer}>
                                        <Text style={styles.sectionNumber}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.sectionTitle} numberOfLines={2}>
                                        {section.title}
                                    </Text>
                                    <Text style={styles.sectionCount}>{section.count}</Text>
                                </View>
                            ))}
                            <View style={styles.sectionTotalRow}>
                                <Text style={styles.sectionTotalLabel}>RAZEM</Text>
                                <Text style={styles.sectionTotalCount}>40</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.warning}>
                    <Text style={styles.warningText}>
                        W trybie egzaminu nie pokazujemy podpowiedzi i uzasadnień po zaznaczeniu odpowiedzi. Wynik zobaczysz na końcu.
                    </Text>
                </View>
                
                <View style={styles.bottomSpacer} />
            </ScrollView>

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
        paddingHorizontal: 24,
        paddingBottom: 20,
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
        fontFamily: 'Nunito_800ExtraBold',
    },
    meta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
        lineHeight: 18,
        fontFamily: 'Nunito_600SemiBold',
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
    infoTextContainer: {
        flex: 1,
    },
    expandIcon: {
        padding: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 2,
        fontFamily: 'Nunito_800ExtraBold',
    },
    sectionsList: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        marginTop: -6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    sectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    sectionNumberContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionNumber: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.textMuted,
        fontFamily: 'Nunito_800ExtraBold',
    },
    sectionTitle: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textMain,
        fontWeight: '600',
        paddingRight: 12,
        fontFamily: 'Nunito_600SemiBold',
    },
    sectionCount: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.primary,
        fontFamily: 'Nunito_800ExtraBold',
    },
    sectionTotalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        marginTop: 6,
    },
    sectionTotalLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.textMuted,
        fontFamily: 'Nunito_800ExtraBold',
        paddingLeft: 36,
    },
    sectionTotalCount: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        fontFamily: 'Nunito_800ExtraBold',
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
        fontFamily: 'Nunito_600SemiBold',
    },
    bottomSpacer: {
        height: 40,
    },
    footer: {
        padding: 24,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
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
        fontFamily: 'Nunito_700Bold',
    },
});
