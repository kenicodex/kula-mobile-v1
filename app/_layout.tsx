import {
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto';
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/auth.store';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 1000 * 60 * 2,
    },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const { token, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    // Post-signup onboarding routes live under (auth) but require a token —
    // don't bounce authenticated users out of them.
    const inPostSignupFlow =
      inAuthGroup &&
      (segments[1] === 'profile' ||
        (segments[1] === 'creator' && segments[2] === 'onboard') ||
        (segments[1] === 'creator' && segments[2] === 'pending'));

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/onboarding');
    } else if (token && inAuthGroup && !inPostSignupFlow) {
      router.replace('/(tabs)');
    }
  }, [token, segments, isLoading]);

  return null;
}

function ThemedApp({ onLayoutRootView }: { onLayoutRootView: () => void }) {
  const { theme, isDark } = useTheme();

  const navTheme = useMemo(
    () => ({
      ...(isDark ? NavDarkTheme : NavDefaultTheme),
      colors: {
        ...(isDark ? NavDarkTheme.colors : NavDefaultTheme.colors),
        background: theme.surface,
        card: theme.card,
        text: theme.ink,
        border: theme.hair,
        primary: theme.primary,
      },
    }),
    [isDark, theme],
  );

  return (
    <NavThemeProvider value={navTheme}>
      <View
        style={{ flex: 1, backgroundColor: theme.surface }}
        onLayout={onLayoutRootView}
      >
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }} />
        <FlashMessage position="top" />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Oswald_600SemiBold: require('../assets/fonts/Oswald/static/Oswald-SemiBold.ttf'),
    Oswald_700Bold: require('../assets/fonts/Oswald/static/Oswald-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <ThemedApp onLayoutRootView={onLayoutRootView} />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
