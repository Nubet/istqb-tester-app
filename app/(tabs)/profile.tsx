import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, BookOpen, Bell } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS } from '@/constants/colors';

export default function ProfileScreen() {
    const router = useRouter();

    const settings = [
        {
            icon: Globe,
            title: 'Język aplikacji',
            meta: 'Polski',
        },
        {
            icon: BookOpen,
            title: 'Tryb nauki',
            meta: 'msg',
        },
        {
            icon: Bell,
            title: 'Egzamin',
            meta: 'msg',
        },
    ];

    return (
        <View style={styles.container}>
            <ScreenHeader title="Ustawienia" />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
