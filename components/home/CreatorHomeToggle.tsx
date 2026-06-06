import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export type CreatorHomeMode = "feed" | "dashboard";

const OPTIONS: {
  key: CreatorHomeMode;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "feed", label: "Feed", icon: "home-outline" },
  { key: "dashboard", label: "Dashboard", icon: "grid-outline" },
];

interface CreatorHomeToggleProps {
  mode: CreatorHomeMode;
  onChange: (mode: CreatorHomeMode) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Segmented control shown at the top of a creator's home tab so they can switch
 * between browsing the community feed and managing their creator dashboard.
 */
export function CreatorHomeToggle({ mode, onChange, style }: CreatorHomeToggleProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: theme.card,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: theme.hair,
          padding: 4,
        },
        style,
      ]}
    >
      {OPTIONS.map((o) => {
        const active = mode === o.key;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: active ? theme.primary : "transparent",
              gap: 6,
            }}
          >
            <Ionicons
              name={o.icon}
              size={16}
              color={active ? theme.white : theme.inkMuted}
            />
            <Text
              style={{
                color: active ? theme.white : theme.inkMuted,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default CreatorHomeToggle;
