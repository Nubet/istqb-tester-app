import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function BookmarksScreen() {
    const router = useRouter();
    const { bookmarks, isEmpty } = useBookmarks();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={20} color={COLORS.card} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Oznaczone</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {isEmpty ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>
                            Aktualnie nie posiadasz, żadnych oznaczonych pytań.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {bookmarks.map((bookmark) => (
                            <View key={bookmark.questionId} style={styles.item}>
                                <Text style={styles.itemSource}>{bookmark.source === 'exam' ? 'Egzamin próbny' : 'Tryb nauki'}</Text>
                                <Text style={styles.itemTitle}>Pytanie {bookmark.questionId}</Text>
                                <Text style={styles.meta}>Oznaczono do powtórki.</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
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
    intro: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    introText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textMuted,
        lineHeight: 18,
    },
    empty: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 20,
    },
    list: {
        gap: 14,
    },
    item: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.accent,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    itemSource: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.accent,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    meta: {
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: '600',
    },
});
