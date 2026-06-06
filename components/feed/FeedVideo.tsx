import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';

interface FeedVideoProps {
  uri: string;
  /** Container style — sets the playback area dimensions (e.g. aspectRatio). */
  style: StyleProp<ViewStyle>;
  /** Tap anywhere on the video (outside the mute button) to open the post. */
  onPress?: () => void;
  /** Play only while active (visible). Off-screen videos pause to save power. */
  active?: boolean;
  /** Show the corner mute toggle. */
  showMuteButton?: boolean;
}

/**
 * Autoplaying, looping, muted-by-default video for the reels feed. RN's <Image>
 * can't render a video URL (which is why reels showed blank), so video posts use
 * this instead. Tap toggles sound; tapping the surface opens the post.
 */
export function FeedVideo({
  uri,
  style,
  onPress,
  active = true,
  showMuteButton = true,
}: FeedVideoProps) {
  const [muted, setMuted] = useState(true);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    if (active) p.play();
  });

  // Drive playback from visibility so only the on-screen reel plays.
  useEffect(() => {
    if (active) player.play();
    else player.pause();
  }, [active, player]);

  const toggleMute = () => {
    const next = !muted;
    player.muted = next;
    setMuted(next);
  };

  return (
    <View style={style}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
      />
      {/* Transparent layer so a tap reaches `onPress` (VideoView swallows touches). */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onPress} />
      {showMuteButton && (
        <Pressable onPress={toggleMute} hitSlop={8} style={styles.muteBtn}>
          <Ionicons
            name={muted ? 'volume-mute' : 'volume-high'}
            size={16}
            color="#fff"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  muteBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedVideo;
