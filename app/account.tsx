import React from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { NavHeader } from '@/components/layout/NavHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './account.styles';

const SUPPORT_EMAIL = 'support@kula.app';

interface MenuItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function MenuItem({ icon, label, onPress, destructive = false }: MenuItemProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed ? { opacity: 0.7 } : null,
      ]}
    >
      <View
        style={[
          styles.menuIcon,
          destructive ? styles.menuIconDestructive : styles.menuIconDefault,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? theme.error : theme.inkLight}
        />
      </View>
      <Text
        style={[
          styles.menuLabel,
          destructive ? styles.menuLabelDestructive : styles.menuLabelDefault,
        ]}
      >
        {label}
      </Text>
      {!destructive && (
        <Ionicons name="chevron-forward" size={16} color={theme.inkFaint} />
      )}
    </Pressable>
  );
}

export default function AccountScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/onboarding');
          },
        },
      ],
    );
  };

  const contactSupport = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=Kula%20support%20request`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Contact support', `Email us at ${SUPPORT_EMAIL}`);
    }
  };

  const comingSoon = (label: string) =>
    Alert.alert(label, 'This feature is coming soon.');

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <NavHeader title="My Account" backVariant="circle" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User card */}
        <View style={styles.userCardWrap}>
          <Card style={styles.userCard}>
            <Avatar uri={user?.avatar} name={user?.name} size="lg" />
            <View style={styles.userBody}>
              <Text style={styles.userName}>
                {user?.name ?? 'Guest'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email ?? ''}
              </Text>
              {user?.isVerified && (
                <View style={styles.verifiedRow}>
                  <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                  <Text style={styles.verifiedText}>
                    Verified
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              onPress={() => router.push('/profile/edit')}
              style={styles.editBtn}
            >
              <Ionicons name="create-outline" size={16} color={theme.inkLight} />
            </Pressable>
          </Card>
        </View>

        {/* Menu sections */}
        <View style={styles.menuSection}>
          <Card style={styles.cardSpacer}>
            <MenuItem
              icon="restaurant-outline"
              label="Find a Creator"
              onPress={() => router.push('/creators')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="calendar-outline"
              label="My Bookings"
              onPress={() => router.push('/bookings')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="bookmark-outline"
              label="Saved"
              onPress={() => router.push('/saved')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="chatbubbles-outline"
              label="Messages"
              onPress={() => router.push('/inbox')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => router.push('/notifications')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="card-outline"
              label="Payment Methods"
              onPress={() => comingSoon('Payment Methods')}
            />
          </Card>

          <Card style={styles.cardSpacer}>
            <MenuItem
              icon="briefcase-outline"
              label="My Portfolio"
              onPress={() => router.push('/portfolio')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="images-outline"
              label="My Posts"
              onPress={() => router.push('/my-posts')}
            />
            {user?.role !== 'creator' && (
              <>
                <View style={styles.divider} />
                <MenuItem
                  icon="ribbon-outline"
                  label="Become a Creator"
                  onPress={() => router.push('/(auth)/creator/onboard/step1')}
                />
              </>
            )}
            <View style={styles.divider} />
            <MenuItem
              icon="settings-outline"
              label="Settings"
              onPress={() => router.push('/settings')}
            />
            <View style={styles.divider} />
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={contactSupport}
            />
          </Card>

          <Card>
            <MenuItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleLogout}
              destructive
            />
          </Card>
        </View>

        {/* App version */}
        <Text style={styles.version}>
          Kula v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
