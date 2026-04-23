import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
                <View style={styles.container}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#f5f1de' },
                        }}
                    >
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen
                            name="exam-run"
                            options={{ presentation: 'fullScreenModal' }}
                        />
                        <Stack.Screen
                            name="results"
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="glossary/index"
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="glossary/list"
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="glossary/flashcards/index"
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="glossary/flashcards/session"
                            options={{ presentation: 'card' }}
                        />
                        <Stack.Screen
                            name="review"
                            options={{ presentation: 'card' }}
                        />
                    </Stack>
                </View>
            </SafeAreaProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
    },
});
