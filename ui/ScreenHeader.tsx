import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

interface ScreenHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    leftAction?: React.ReactNode;
    rightActions?: React.ReactNode;
    children?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    bottomRadius?: boolean;
}

export function ScreenHeader({
    title,
    showBack = false,
    onBack,
    leftAction,
    rightActions,
    children,
    containerStyle,
    contentStyle,
    bottomRadius = true,
}: ScreenHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const hasTopRow = showBack || leftAction || title || rightActions;

    return (
        <SafeAreaView
            style={[
                styles.header,
                bottomRadius && styles.bottomRadius,
                containerStyle,
            ]}
            edges={['top']}
        >
            {hasTopRow && (
                <View style={[styles.headerTopRow, contentStyle]}>
                    <View style={styles.leftCol}>
                        {leftAction ? (
                            leftAction
                        ) : showBack ? (
                            <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
                                <ArrowLeft size={22} color={COLORS.card} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>

                    <View style={styles.centerCol}>
                        {title && <Text style={styles.headerTitle}>{title}</Text>}
                    </View>

                    <View style={styles.rightCol}>
                        {rightActions ? (
                            <View style={styles.headerActions}>{rightActions}</View>
                        ) : (
                            <View style={styles.placeholder} />
                        )}
                    </View>
                </View>
            )}
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingBottom: 12,
    },
    bottomRadius: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        paddingBottom: 8,
        paddingTop: 8,
        minHeight: 54,
        position: 'relative',
    },
    leftCol: {
        position: 'absolute',
        left: 6,
        zIndex: 10,
    },
    centerCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
    },
    rightCol: {
        position: 'absolute',
        right: 6,
        zIndex: 10,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    iconBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.card,
        textAlign: 'center',
    },
    placeholder: {
        width: 38,
    },
});
