import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth.store';
import { useStyles } from '@/hooks/useStyles';
import { makeStyles } from './index.styles';

export default function IndexScreen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { token, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [token, isLoading]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* Logo mark */}
      <View style={styles.logoWrap}>
        {/* <Image
          source={require('../assets/kula-logo-orange.jpg')}
          resizeMode="contain"
          style={{ width: 224, height: 224 }}
        /> */}

        <Text style={styles.tagline}>
          Your personal chef, on demand
        </Text>
      </View>
    </View>
  );
}
