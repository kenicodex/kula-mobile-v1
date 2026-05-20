import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './settings.styles';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [push, setPush] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [location, setLocation] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionHeader title="Account" />
        <NavTile icon="person-outline" label="Edit Profile" />
        <NavTile icon="lock-closed-outline" label="Change Password" />
        <NavTile icon="call-outline" label="Phone Number" value="+234 812 345 6789" />
        <NavTile icon="mail-outline" label="Email Address" value="user@email.com" />

        <SectionHeader title="Notifications" />
        <ToggleTile
          icon="notifications-outline"
          label="Push Notifications"
          value={push}
          onChange={setPush}
        />
        <ToggleTile
          icon="alarm-outline"
          label="Booking Reminders"
          value={reminders}
          onChange={setReminders}
        />
        <ToggleTile
          icon="megaphone-outline"
          label="Marketing Emails"
          value={marketing}
          onChange={setMarketing}
        />

        <SectionHeader title="Privacy & Location" />
        <ToggleTile
          icon="location-outline"
          label="Location Services"
          value={location}
          onChange={setLocation}
        />
        <NavTile icon="shield-checkmark-outline" label="Privacy Policy" />
        <NavTile icon="document-text-outline" label="Terms of Service" />

        <SectionHeader title="Support" />
        <NavTile icon="help-circle-outline" label="Help Center" />
        <NavTile icon="chatbubbles-outline" label="Contact Us" />
        <NavTile icon="information-circle-outline" label="About Kula" value="v1.0.0" />

        <View style={styles.logoutWrap}>
          <Pressable
            onPress={() => {
              Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                      logout();
                      router.replace('/(auth)/onboarding');
                    },
                  },
                ],
              );
            }}
            style={styles.logoutBtn}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function NavTile({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navTile,
        pressed ? { backgroundColor: theme.surface } : null,
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.inkLight} />
      <Text style={styles.navTileLabel}>{label}</Text>
      {value && <Text style={styles.navTileValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color={theme.inkMuted} />
    </Pressable>
  );
}

function ToggleTile({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.toggleTile}>
      <Ionicons name={icon} size={20} color={theme.inkLight} />
      <Text style={styles.toggleTileLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.hair, true: theme.primary }}
        thumbColor={theme.white}
      />
    </View>
  );
}
