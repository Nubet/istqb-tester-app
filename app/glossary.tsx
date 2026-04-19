import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { useGlossary } from '@/hooks/useGlossary';

export default function GlossaryScreen() {
    const router = useRouter();
    const { terms, isLoading, searchQuery, setSearchQuery } = useGlossary();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTopRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={20} color={COLORS.card} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Glosariusz</Text>
                    <View style={styles.placeholder} />
                </View>
                
                <View style={styles.searchContainer}>
                    <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Szukaj pojęcia..."
                        placeholderTextColor={COLORS.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                            <X size={16} color={COLORS.card} />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Ładowanie glosariusza...</Text>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.list}>
                        {terms.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Nie znaleziono pojęć dla "{searchQuery}"</Text>
                            </View>
                        ) : (
                            terms.map((term) => (
                                <View key={term.id} style={styles.card}>
                                    <Text style={styles.termTitle}>{term.term}</Text>
                                    <Text style={styles.definition}>{term.definition}</Text>
                                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                                        <Text style={styles.related}>
                                            Zobacz też: {term.relatedTerms.join(', ')}
                                        </Text>
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            )}
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
        paddingHorizontal: 16,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: COLORS.textMain,
    },
    clearBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.textMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textMuted,
        fontWeight: '500',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    list: {
        gap: 14,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    termTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.textMain,
        marginBottom: 8,
    },
    definition: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    related: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        marginTop: 12,
        fontStyle: 'italic',
    },
});
