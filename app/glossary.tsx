import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { glossaryTerms } from '../data/mockData';

export default function GlossaryScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <ArrowLeft size={20} color={COLORS.card} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Glosariusz</Text>
                <View style={styles.placeholder} />
            </SafeAreaView>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.list}>
                    {glossaryTerms.map((term) => (
                        <View key={term.id} style={styles.card}>
                            <Text style={styles.termTitle}>{term.term}</Text>
                            <Text style={styles.definition}>{term.definition}</Text>
                            {term.relatedTerms && term.relatedTerms.length > 0 && (
                                <Text style={styles.related}>
                                    Zobacz też: {term.relatedTerms.join(', ')}
                                </Text>
                            )}
                        </View>
                    ))}
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
