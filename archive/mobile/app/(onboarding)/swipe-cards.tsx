import { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { swipeCards } from "@lib/onboarding/cards";
import { calculateDimensionScores } from "@lib/onboarding/scoring";
import { calculateTravelerType, type DimensionScoreInput } from "@lib/onboarding/typeCalculator";
import type { CardResponse, SwipeResponse } from "@lib/onboarding/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;
const TOTAL_CARDS = swipeCards.length;

const PLACEHOLDER_DESCRIPTIONS = [
  "Crowded vibrant street at golden hour",
  "Dinner table at sunset",
  "Rugged hiking trail, scrambling",
  "Flat-lay of daily itinerary with coffee and tickets",
  "Hammock with ocean view",
  "Sommelier pouring wine, fine dining",
  "Someone at ceramics wheel, golden light",
  "Window seat on packed local bus, foreign script",
  "Hotel balcony at dusk, rooftops, wine glass",
  "Lone figure on crumbling stone wall, misty valley",
  "Sun-dappled town square, old men at table, pigeons",
  "Blurry neon festival, paint on faces, smoke",
];

// Pre-built card content — never changes, never re-renders
function StaticCard({
  caption,
  placeholderText,
  captionBottom,
}: {
  caption: string;
  placeholderText: string;
  captionBottom: number;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#9CA3AF",
            fontFamily: "Lora_400Regular",
            fontSize: 14,
            textAlign: "center",
            paddingHorizontal: 40,
          }}
        >
          Placeholder: {placeholderText}
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0.30)", "rgba(0,0,0,0.50)", "rgba(0,0,0,1.00)"]}
        locations={[0, 0.64, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Text
        style={{
          position: "absolute",
          left: 27,
          bottom: captionBottom,
          width: 339,
          fontFamily: "Lora_400Regular",
          fontSize: 32,
          lineHeight: 38,
          color: "#FFFFFF",
        }}
      >
        {caption}
      </Text>
    </View>
  );
}

// Animated wrapper for each card — handles position/scale/opacity based on depth
function AnimatedCard({
  depth,
  translateX,
  children,
}: {
  depth: number; // 0 = front, 1 = next, 2 = third, 3+ = hidden
  translateX: { value: number };
  children: React.ReactNode;
}) {
  const animStyle = useAnimatedStyle(() => {
    if (depth === 0) {
      // Front card: follows gesture
      return {
        zIndex: TOTAL_CARDS,
        opacity: 1,
        transform: [
          { translateX: translateX.value },
          {
            rotate: `${interpolate(
              translateX.value,
              [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
              [-10, 0, 10],
              Extrapolation.CLAMP
            )}deg`,
          },
        ],
      };
    }

    if (depth === 1) {
      // Next card: scales up as front card is dragged
      const absX = Math.abs(translateX.value);
      return {
        zIndex: TOTAL_CARDS - 1,
        opacity: 1,
        transform: [
          {
            scale: interpolate(
              absX,
              [0, SWIPE_THRESHOLD],
              [0.95, 1],
              Extrapolation.CLAMP
            ),
          },
          {
            translateY: interpolate(
              absX,
              [0, SWIPE_THRESHOLD],
              [8, 0],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    }

    if (depth === 2) {
      // Third card: static, slightly scaled
      return {
        zIndex: TOTAL_CARDS - 2,
        opacity: 1,
        transform: [{ scale: 0.9 }, { translateY: 16 }],
      };
    }

    // All other cards: hidden but rendered
    return {
      zIndex: 0,
      opacity: 0,
      transform: [{ scale: 0.9 }, { translateY: 16 }],
    };
  }, [depth]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
      {children}
    </Animated.View>
  );
}

export default function SwipeCardsScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const isFromProfile = source === "profile";
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<CardResponse[]>([]);
  const translateX = useSharedValue(0);
  const captionBottom = insets.bottom + 197;

  const handleSwipe = useCallback(
    async (direction: SwipeResponse) => {
      const card = swipeCards[currentIndex];
      const newResponses = [
        ...responses,
        { cardId: card.id, response: direction },
      ];
      setResponses(newResponses);
      translateX.value = 0;

      // Dev logging: running scores after each card
      const partialScores = calculateDimensionScores(newResponses, swipeCards);
      console.log(
        `Card ${card.id} swiped ${direction}. Running scores: PF:${partialScores.plan_flow_score - 50} BR:${partialScores.busy_relaxed_score - 50} CA:${partialScores.comfort_adventure_score - 50} IO:${partialScores.immerse_observe_score - 50}`
      );

      if (currentIndex >= TOTAL_CARDS - 1) {
        const swipeScores = {
          plan_flow: partialScores.plan_flow_score - 50,
          busy_relaxed: partialScores.busy_relaxed_score - 50,
          comfort_adventure: partialScores.comfort_adventure_score - 50,
          immerse_observe: partialScores.immerse_observe_score - 50,
        };
        await AsyncStorage.setItem("journy_swipe_scores", JSON.stringify(swipeScores));
        console.log("Swipe scores saved:", swipeScores);

        if (isFromProfile) {
          // Recalculate type and check if it changed
          const zero: DimensionScoreInput = { plan_flow: 0, busy_relaxed: 0, comfort_adventure: 0, immerse_observe: 0 };
          let ddScores = zero;
          try {
            const raw = await AsyncStorage.getItem("journy_dreamday_scores");
            if (raw) ddScores = JSON.parse(raw);
          } catch {}
          const newResult = calculateTravelerType(swipeScores, ddScores);
          let oldCode: string | null = null;
          try {
            const raw = await AsyncStorage.getItem("journy_type_result");
            if (raw) oldCode = JSON.parse(raw).code;
          } catch {}
          await AsyncStorage.setItem("journy_type_result", JSON.stringify(newResult));
          await AsyncStorage.setItem("journy_type_color", newResult.groupColor);
          if (newResult.code !== oldCode) {
            router.push({ pathname: "/(onboarding)/type-reveal", params: { mode: "updated" } });
          } else {
            router.push("/(tabs)/profile");
          }
        } else {
          router.push("/(onboarding)/dream-day-intro");
        }
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentIndex, responses, router, translateX]
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => runOnJS(handleSwipe)("right")
        );
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          -SCREEN_WIDTH * 1.5,
          { duration: 300 },
          () => runOnJS(handleSwipe)("left")
        );
      } else {
        translateX.value = withTiming(0, {
          duration: 220,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const handleButtonPress = useCallback(
    (direction: SwipeResponse) => {
      const targetX =
        direction === "left" ? -SCREEN_WIDTH * 1.5 : SCREEN_WIDTH * 1.5;
      translateX.value = withTiming(targetX, { duration: 300 }, () =>
        runOnJS(handleSwipe)(direction)
      );
    },
    [handleSwipe, translateX]
  );

  const progressWidth = 3 + ((currentIndex + 1) / TOTAL_CARDS) * 35;

  // Pre-render all 12 cards — content never changes, only depth changes
  const cardLayers = useMemo(
    () =>
      swipeCards.map((card, i) => ({
        id: card.id,
        caption: card.caption,
        placeholder: PLACEHOLDER_DESCRIPTIONS[card.id - 1],
        index: i,
      })),
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />

      {/* All 12 cards rendered once, positioned by depth relative to currentIndex */}
      {cardLayers.map((card) => (
        <AnimatedCard
          key={card.id}
          depth={card.index - currentIndex}
          translateX={translateX}
        >
          <StaticCard
            caption={card.caption}
            placeholderText={card.placeholder}
            captionBottom={captionBottom}
          />
        </AnimatedCard>
      ))}

      {/* Gesture overlay — sits on top of all cards, captures pan */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { zIndex: TOTAL_CARDS + 1 }]}
          collapsable={false}
        />
      </GestureDetector>

      {/* Progress bar + text overlay — hidden during profile redo */}
      {!isFromProfile && <View
        style={{
          position: "absolute",
          top: 90,
          left: 20,
          right: 20,
          zIndex: TOTAL_CARDS + 2,
        }}
        pointerEvents="none"
      >
        <View
          style={{
            height: 4,
            backgroundColor: "#E5E7EB",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progressWidth}%`,
              height: 4,
              backgroundColor: "#1A7D7A",
              borderRadius: 2,
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: "Lora_400Regular",
            fontSize: 12,
            lineHeight: 17,
            color: "#FFFFFF",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Step: {currentIndex + 1} of 12
        </Text>
      </View>}

      {/* Action buttons */}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom + 82,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 42,
          zIndex: TOTAL_CARDS + 3,
        }}
      >
        <Pressable
          onPress={() => handleButtonPress("left")}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#1A7D7A",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 22,
              color: "#E6F5F4",
              fontWeight: "700",
              marginTop: -1,
            }}
          >
            ✕
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleButtonPress("super_like")}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#E8845C",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 26,
              color: "#FFFFFF",
              marginTop: -1,
            }}
          >
            ☆
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleButtonPress("right")}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "#1A7D7A",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 24,
              color: "#FFFFFF",
            }}
          >
            ♡
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
