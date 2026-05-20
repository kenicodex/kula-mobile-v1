import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/hooks/useTheme";
import { makeStyles } from "./onboarding.styles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: "1",
    image: require("@/assets/images/onboarding/slide-1.jpg"),
    title: "Find Your Perfect Chef",
    subtitle:
      "Browse verified professional chefs near you, check their menus, ratings, and specialties before booking.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding/slide-2.jpg"),
    title: "Book in Minutes",
    subtitle:
      "Instantly book a chef for any occasion — from intimate dinners to large events. Flexible scheduling that works for you.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding/slide-3.jpg"),
    title: "Enjoy Restaurant Quality at Home",
    subtitle:
      "Experience fine dining in the comfort of your own home. Fresh ingredients, custom menus, memorable moments.",
  },
];

function SlideItem({ item }: { item: Slide }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.slideTextWrap}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const styles = useStyles(makeStyles);
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLast = activeIndex === slides.length - 1;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  );

  const goNext = () => {
    if (isLast) {
      router.push("/(auth)/account-type");
    } else {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const skip = () => {
    router.push("/(auth)/account-type");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

      <View style={styles.skipRow}>
        {!isLast ? (
          <Pressable onPress={skip} hitSlop={10}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.slidesContainer}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => <SlideItem item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled

          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />
      </View>

      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.ctaWrap}>
        <Button
          label={isLast ? "Get Started" : "Next"}
          onPress={goNext}
          size="lg"
          variant="primary"
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}
