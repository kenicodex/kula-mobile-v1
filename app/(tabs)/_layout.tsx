import React from 'react';
import { Pressable, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/hooks/useTheme';
import { useStyles } from '@/hooks/useStyles';
import { makeStyles, makeTabBarStyle, tabBarLabelStyle } from './layout.styles';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconName;
  activeName: IoniconName;
  focused: boolean;
  size?: number;
}

function TabIcon({ name, activeName, focused, size = 24 }: TabIconProps) {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.tabIconWrap}>
      <Ionicons
        name={focused ? activeName : name}
        size={size}
        color={focused ? theme.tabActive : theme.tabInactive}
      />
    </View>
  );
}

function CreateTabButton() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/post/create')}
      hitSlop={10}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: theme.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={28} color={theme.white} />
      </View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const tabBarStyle = makeTabBarStyle(theme);
  const role = useAuthStore((s) => s.user?.role);
  const isChef = role === 'chef';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle,
        tabBarLabelStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" activeName="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search-outline" activeName="search" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          href: isChef ? null : '/saved',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="bookmark-outline" activeName="bookmark" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={
          isChef
            ? {
                title: '',
                tabBarButton: () => <CreateTabButton />,
              }
            : {
                href: null,
              }
        }
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="receipt-outline" activeName="receipt" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" activeName="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
