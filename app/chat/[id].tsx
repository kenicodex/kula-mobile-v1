import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';
import { Avatar } from '@/components/ui/Avatar';
import { messagingService, apiErrorMessage } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { fmtTime } from '@/lib/format';
import type { Message as ChatMessage } from '@/types';
import { useStyles } from '@/hooks/useStyles';
import { useTheme } from '@/hooks/useTheme';
import { makeStyles } from './[id].styles';

export default function ChatScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', id],
    queryFn: () => messagingService.messages(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  // Mark conversation read when entering
  useEffect(() => {
    if (id) {
      messagingService.markRead(id).catch(() => undefined);
    }
  }, [id]);

  const send = useMutation({
    mutationFn: (body: string) =>
      messagingService.send(id, { text: body }),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['messages', id] });
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    },
    onError: (err) => {
      showMessage({
        message: apiErrorMessage(err, 'Could not send message.'),
        type: 'danger',
      });
    },
  });

  // Conversations endpoint returns participants; we use the auth user id to
  // determine which side of each bubble to render messages on.
  const list = messages ?? [];

  function onSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    send.mutate(trimmed);
  }

  const hasText = !!text.trim();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={theme.ink} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Avatar name="Chat" size="sm" />
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Conversation</Text>
            <Text style={styles.headerSubtitle}>{list.length} messages</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex1}
      >
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={list}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Start the conversation 👋</Text>
              </View>
            }
            renderItem={({ item }) => {
              const fromMe = item.senderId === user?.id;
              if (item.type === 'system') {
                return (
                  <View style={styles.systemRow}>
                    <View style={styles.systemBubble}>
                      <Text style={styles.systemText}>{item.text}</Text>
                    </View>
                  </View>
                );
              }
              return (
                <View
                  style={[
                    styles.bubbleRow,
                    fromMe ? styles.bubbleRowMine : styles.bubbleRowOther,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      fromMe ? styles.bubbleMine : styles.bubbleOther,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        fromMe ? styles.bubbleTextMine : styles.bubbleTextOther,
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        fromMe ? styles.bubbleTimeMine : styles.bubbleTimeOther,
                      ]}
                    >
                      {fmtTime(item.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View style={styles.inputBar}>
          <Pressable hitSlop={8} style={styles.attachButton}>
            <Ionicons name="add" size={20} color={theme.inkMuted} />
          </Pressable>
          <View style={styles.textInputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message…"
              placeholderTextColor={theme.inkFaint}
              multiline
              style={styles.textInput}
            />
          </View>
          <Pressable
            onPress={onSend}
            hitSlop={8}
            disabled={!hasText || send.isPending}
            style={[
              styles.sendButton,
              hasText ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
          >
            <Ionicons name="send" size={16} color={theme.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
