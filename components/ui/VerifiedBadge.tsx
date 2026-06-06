import React from "react";
import { StyleProp, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { UserRole } from "@/types";
import { useTheme } from "@/hooks/useTheme";

interface VerifiedBadgeProps {
  /** Role of the user the badge belongs to. Creators get the brand color. */
  role?: UserRole | null;
  size?: number;
  style?: StyleProp<TextStyle>;
}

/**
 * Verification check-tick shown next to a user's name. Creators get the app's
 * brand color; everyone else gets a neutral grey tick.
 */
export function VerifiedBadge({ role, size = 14, style }: VerifiedBadgeProps) {
  const { theme } = useTheme();
  const color = role === "creator" ? theme.primary : theme.inkMuted;
  return (
    <Ionicons name="checkmark-circle" size={size} color={color} style={style} />
  );
}

export default VerifiedBadge;
