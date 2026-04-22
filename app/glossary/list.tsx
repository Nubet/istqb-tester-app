import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { useGlossary } from '@/hooks/useGlossary';
import { glossaryService } from '@/services';
import { ScreenHeader } from '@/ui/ScreenHeader';

function normalizeMode(mode?: string): 'all' | 'categories' {
    return mode === 'categories' ? 'categories' : 'all';
}

export default function GlossaryListScreen() {
    const params = useLocalSearchParams<{ mode?: string }>();
    const mode = normalizeMode(params.mode);
    const isCategoryMode = mode === 'categories';
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const shouldLoadTerms = !isCategoryMode || selectedCategory !== null;

    const { terms, isLoading, searchQuery, setSearchQuery } = useGlossary(shouldLoadTerms);

    const { data: categories = [], isLoading: isLoadingCategories, isError: isCategoriesError } = useQuery({
        queryKey: ['glossaryCategories'],
        queryFn: () => glossaryService.getCategories(),
        enabled: isCategoryMode,
    });

    const filteredTerms = useMemo(() => {
        if (!isCategoryMode || !selectedCategory) {
            return terms;
        }

        return terms.filter((term) => term.category === selectedCategory);
    }, [isCategoryMode, selectedCategory, terms]);

    const emptyMessage = isCategoryMode && selectedCategory
        ? `Brak wyników dla kategorii "${selectedCategory}"`
        : `Nie znaleziono pojęć dla "${searchQuery}"`;

    if (isCategoryMode && !selectedCategory) {
        return (
            <View style={styles.container}>
                <ScreenHeader title="Glosariusz" showBack />

                <View style={styles.selectionContent}>
                    <Text style={styles.sectionIntro}>Wybierz kategorię, z której chcesz przeglądać pojęcia.</Text>

                    {isLoadingCategories ? (
                        <View style={styles.center}>
                            <Text style={styles.loadingText}>Ładowanie kategorii...</Text>
                        </View>
                    ) : isCategoriesError ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nie udało się załadować kategorii. Spróbuj ponownie.</Text>
                        </View>
                    ) : (
                        <ScrollView
                            style={styles.categoryScroll}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.options}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    style={styles.sectionButton}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory(category);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.sectionChapter}>KATEGORIA</Text>
                                    <Text style={styles.sectionTitle}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                            {categories.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Brak kategorii do wyświetlenia.</Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title={isCategoryMode ? selectedCategory ?? 'Glosariusz' : 'Glosariusz'}
                showBack={!isCategoryMode}
                leftAction={isCategoryMode ? (
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                        }}
                    >
                        <X size={18} color={COLORS.card} />
                    </TouchableOpacity>
                ) : undefined}
            >
                <View style={styles.searchContainer}>
                    <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={isCategoryMode ? 'Szukaj pojęcia w tej kategorii...' : 'Szukaj pojęcia...'}
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
            </ScreenHeader>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Ładowanie glosariusza...</Text>
                </View>
            ) : (
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.list}>
                        {filteredTerms.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{emptyMessage}</Text>
                            </View>
                        ) : (
                            filteredTerms.map((term) => (
                                <View key={term.id} style={styles.card}>
                                    <Text style={styles.termTitle}>{term.term}</Text>
                                    <Text style={styles.definition}>{term.definition}</Text>
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
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectionContent: {
        flex: 1,
        padding: 24,
    },
    categoryScroll: {
        flex: 1,
    },
    sectionIntro: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    options: {
        gap: 12,
        paddingBottom: 24,
    },
    sectionButton: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 20,
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary,
        ...SHADOWS.soft,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textMain,
    },
    sectionChapter: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.3,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginHorizontal: 8,
        marginBottom: 8,
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
        ...SHADOWS.soft,
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
});
