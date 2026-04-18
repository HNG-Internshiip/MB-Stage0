import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '@/constants/theme';

const ONBOARDING_KEY = '@sut_onboarded';

export default function RootLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
        // Slight delay so the splash screen doesn't flash
        setTimeout(() => {
          router.replace(seen ? '/(tabs)' : '/onboarding');
          setChecking(false);
        }, 200);
      } catch {
        router.replace('/onboarding');
        setChecking(false);
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={theme.navBg} translucent={false} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg }, animation: 'fade' }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      {/* Loading overlay while checking AsyncStorage */}
      {checking && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.accent} size="large" />
        </View>
      )}
    </SafeAreaProvider>
  );
}

// Need StyleSheet for the overlay
import { StyleSheet } from 'react-native';