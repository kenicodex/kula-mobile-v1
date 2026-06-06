import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import type { CreatorHomeMode } from "@/components/home/CreatorHomeToggle";

export type { CreatorHomeMode };

const OPTIONS: {
  key: CreatorHomeMode;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "dashboard", label: "Dashboard", icon: "grid-outline" },
  { key: "feed", label: "Feed", icon: "home-outline" },
];

interface CreatorHomeDropdownProps {
  mode: CreatorHomeMode;
  /** Small greeting line shown above the dropdown trigger. */
  greeting: string;
  onChange: (mode: CreatorHomeMode) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Header dropdown letting a creator switch between their dashboard and the
 * community feed. The current section is the tappable title sitting under the
 * "Good morning" greeting; tapping opens a small menu to switch.
 */
export function CreatorHomeDropdown({
  mode,
  greeting,
  onChange,
  style,
}: CreatorHomeDropdownProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find((o) => o.key === mode) ?? OPTIONS[0];

  return (
    <View style={style}>
      <Text style={{ color: theme.inkMuted, fontSize: 11 }}>{greeting}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
      >
        <Text style={{ color: theme.ink, fontSize: 16, fontWeight: "700" }}>
          {current.label}
        </Text>
        <Ionicons name="chevron-down" size={16} color={theme.ink} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
          <View
            style={{
              position: "absolute",
              top: insets.top + 56,
              left: 64,
              minWidth: 184,
              backgroundColor: theme.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.hair,
              paddingVertical: 6,
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            {OPTIONS.map((o) => {
              const active = o.key === mode;
              return (
                <Pressable
                  key={o.key}
                  onPress={() => {
                    onChange(o.key);
                    setOpen(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 11,
                  }}
                >
                  <Ionicons
                    name={o.icon}
                    size={18}
                    color={active ? theme.primary : theme.inkMuted}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: active ? theme.primary : theme.ink,
                      fontWeight: active ? "700" : "500",
                      fontSize: 14,
                    }}
                  >
                    {o.label}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={16} color={theme.primary} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default CreatorHomeDropdown;
