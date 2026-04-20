import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Globe, BookOpen, Bell } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';
import { READING_DENSITY_OPTIONS } from '@/constants/readingDensity';
import { useReadingPreferences } from '@/hooks/useReadingPreferences';

export default function ProfileScreen() {
    const { mode, setMode, isSavingMode } = useReadingPreferences();
    const selectedMode = READING_DENSITY_OPTIONS.find((item) => item.mode === mode) ?? READING_DENSITY_OPTIONS[0];

    const settings = [
        {
            icon: Globe,
            title: 'Język aplikacji',
            meta: 'Polski',
        },
        {
            icon: BookOpen,
            title: 'Tryb nauki',
            meta: selectedMode.label,
        },
        {
            icon: Bell,
            title: 'Egzamin',
            meta: 'Ustawienia domyslne',
        },
    ];

    return (
        <View style={styles.container}>
            <ScreenHeader title="Ustawienia" />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.readingCard}>
                    <Text style={styles.readingTitle}></Text>
                    <Text style={styles.readingMeta}>Dopasuj wielkość tekstu i odstępy na ekranach z pytaniami.</Text>

                    <View style={styles.modeRow}>
                        {READING_DENSITY_OPTIONS.map((option) => {
                            const isActive = option.mode === mode;
                            return (
                                <TouchableOpacity
                                    key={option.mode}
                                    style={[styles.modeChip, isActive && styles.modeChipActive]}
                                    onPress={() => setMode(option.mode)}
                                    activeOpacity={0.85}
                                >
                                    <Text
                                        style={[styles.modeChipText, isActive && styles.modeChipTextActive]}
                                        numberOfLines={2}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                </View>

                <View style={styles.list}>
                    {settings.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconContainer}>
                                    <item.icon size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.cardText}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.meta}>{item.meta}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.version}>
                    <Text style={styles.versionText}>v1.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    list: {
        gap: 14,
        marginTop: 14,
    },
    readingCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    readingTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    readingMeta: {
        marginTop: 4,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        lineHeight: 18,
    },
    modeRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
    },
    modeChip: {
        flex: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    modeChipActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primarySoft,
    },
    modeChipText: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '700',
        color: COLORS.textMain,
        textAlign: 'center',
    },
    modeChipTextActive: {
        color: COLORS.primaryDark,
    },
    readingHint: {
        marginTop: 12,
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    savingHint: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primaryDark,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    meta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    version: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
    versionSubtext: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.textMuted,
        opacity: 0.7,
        marginTop: 4,
    },
});
