import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ListTree, FolderTree, ChevronRight, Layers3 } from 'lucide-react-native';
import { ScreenHeader } from '@/ui/ScreenHeader';
import { COLORS, SHADOWS } from '@/constants/colors';

export default function GlossaryModeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScreenHeader title="Glosariusz" showBack />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                <View style={styles.introCard}>
                    <Text style={styles.introTitle}>Jak chcesz przeglądać pojęcia?</Text>
                    <Text style={styles.introText}>
                        Szybkie wyszukiwanie po całym słowniku albo nauka tematyczna po kategoriach.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/glossary/list?mode=all')}
                >
                    <View style={styles.optionIconWrap}>
                        <ListTree size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.optionTextWrap}>
                        <Text style={styles.optionTitle}>Cała lista</Text>
                        <Text style={styles.optionMeta}>Jedna lista wszystkich pojęć z wyszukiwarką</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/glossary/list?mode=categories')}
                >
                    <View style={styles.optionIconWrap}>
                        <FolderTree size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.optionTextWrap}>
                        <Text style={styles.optionTitle}>Podział na kategorie</Text>
                        <Text style={styles.optionMeta}>Przeglądaj pojęcia blokami tematycznymi</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/glossary/flashcards')}
                >
                    <View style={styles.optionIconWrap}>
                        <Layers3 size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.optionTextWrap}>
                        <Text style={styles.optionTitle}>Fiszki</Text>
                        <Text style={styles.optionMeta}>Ucz się pojęć w trybie fiszek</Text>
                    </View>
                    <ChevronRight size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
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
    },
    contentContainer: {
        padding: 24,
        gap: 14,
    },
    introCard: {
        backgroundColor: COLORS.accentSoft,
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    introTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    introText: {
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
    optionCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.soft,
    },
    optionIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionTextWrap: {
        flex: 1,
        marginRight: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 2,
    },
    optionMeta: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: COLORS.textMuted,
    },
});
