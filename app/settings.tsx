import React from 'react';
import { Alert, Linking, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { NavHeader } from '@/components/layout/NavHeader';
import { useAuthStore } from '@/store/auth.store';
import { usePreferencesStore } from '@/store/preferences.store';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './settings.styles';

const SUPPORT_EMAIL = 'support@kula.app';
const PRIVACY_URL = 'https://kula.app/privacy';
const TERMS_URL = 'https://kula.app/terms';
const HELP_URL = 'https://kula.app/help';

const APP_VERSION =
  (Constants.expoConfig?.version as string | undefined) ?? '1.0.0';

async function openExternal(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert('Cannot open link', url);
  }
}

export default function SettingsScreen() {
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const prefs = usePreferencesStore();

  const contactSupport = () =>
    openExternal(`mailto:${SUPPORT_EMAIL}?subject=Kula%20support%20request`);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <NavHeader title="Settings" backVariant="circle" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionHeader title="Account" />
        <NavTile
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push('/profile/edit')}
        />
        <NavTile
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => router.push('/profile/change-password')}
        />
        <NavTile
          icon="call-outline"
          label="Phone Number"
          value={user?.phone || 'Not set'}
          onPress={() => router.push('/profile/edit')}
        />
        <NavTile
          icon="mail-outline"
          label="Email Address"
          value={user?.email || 'Not set'}
          onPress={() => router.push('/profile/edit')}
        />

        <SectionHeader title="Notifications" />
        <ToggleTile
          icon="notifications-outline"
          label="Push Notifications"
          value={prefs.pushNotifications}
          onChange={(v) => prefs.set({ pushNotifications: v })}
        />
        <ToggleTile
          icon="alarm-outline"
          label="Booking Reminders"
          value={prefs.bookingReminders}
          onChange={(v) => prefs.set({ bookingReminders: v })}
        />
        <ToggleTile
          icon="megaphone-outline"
          label="Marketing Emails"
          value={prefs.marketingEmails}
          onChange={(v) => prefs.set({ marketingEmails: v })}
        />

        <SectionHeader title="Privacy & Location" />
        <ToggleTile
          icon="location-outline"
          label="Location Services"
          value={prefs.locationServices}
          onChange={(v) => prefs.set({ locationServices: v })}
        />
        <NavTile
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => openExternal(PRIVACY_URL)}
        />
        <NavTile
          icon="document-text-outline"
          label="Terms of Service"
          onPress={() => openExternal(TERMS_URL)}
        />

        <SectionHeader title="Support" />
        <NavTile
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => openExternal(HELP_URL)}
        />
        <NavTile
          icon="chatbubbles-outline"
          label="Contact Us"
          onPress={contactSupport}
        />
        <NavTile
          icon="information-circle-outline"
          label="About Kula"
          value={`v${APP_VERSION}`}
          onPress={() =>
            Alert.alert(
              'About Kula',
              `Version ${APP_VERSION}\n\nBuilt with love for our community of clients, creators, and creators.`,
            )
          }
        />

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
