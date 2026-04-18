import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Home, GraduationCap, Clock, Star, User } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarLabelStyle: styles.tabLabel,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'dom',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'nauka',
                    tabBarIcon: ({ color, size }) => <GraduationCap size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="exam"
                options={{
                    title: 'egzamin',
                    tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="bookmarks"
                options={{
                    title: 'oznaczone',
                    tabBarIcon: ({ color, size }) => <Star size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'profil',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.card,
        borderTopWidth: 0,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        paddingBottom: 24,
        paddingTop: 12,
        height: 90,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '800',
        marginTop: 6,
    },
});
