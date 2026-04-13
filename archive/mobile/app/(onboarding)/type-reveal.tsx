import { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Dimensions, Animated, NativeSyntheticEvent, NativeScrollEvent, LayoutAnimation, Platform, UIManager } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  calculateTravelerType,
  scoreToSliderPosition,
  type TypeResult,
  type DimensionScoreInput,
} from "@lib/onboarding/typeCalculator";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SLIDER_COLORS = ["#4A5899", "#C4853A", "#9A5B7A", "#3A8A7A"];
const SLIDER_EXPLANATIONS = [
  "Do you research and book ahead, or figure it out when you get there?",
  "Do you pack every hour, or keep the day wide open?",
  "Do you want things to run smoothly, or is the friction part of the fun?",
  "Do you jump in and participate, or sit back and take it all in?",
];
const LEFT_LABELS = ["Plan", "Busy", "Comfort", "Immerse"];
const RIGHT_LABELS = ["Flow", "Relaxed", "Adventure", "Observe"];
const DIM_KEYS: (keyof TypeResult["dimensions"])[] = [
  "plan_flow",
  "busy_relaxed",
  "comfort_adventure",
  "immerse_observe",
];

// Placeholder content — writer will replace later
const placeholderContent = {
  tagline: "Placeholder tagline goes here.",
  description: {
    title: "Placeholder Section Title",
    pullQuote: "Placeholder pull quote goes here.",
    paragraphs: ["Placeholder paragraph one.", "Placeholder paragraph two."],
  },
  role: {
    title: "Placeholder Role Title",
    paragraphs: ["Placeholder role description."],
  },
  redFlag: "Placeholder red flag sentence.",
  partners: {
    best: [
      { code: "ABCD", name: "The Placeholder", description: "Placeholder compatibility description." },
      { code: "ABCD", name: "The Placeholder", description: "Placeholder compatibility description." },
    ],
    discourse: [
      { code: "ABCD", name: "The Placeholder", description: "Placeholder compatibility description." },
      { code: "ABCD", name: "The Placeholder", description: "Placeholder compatibility description." },
    ],
  },
  funFacts: {
    destinations: "City 1, City 2, City 3",
    packingStyle: "Placeholder packing style.",
    groupChat: "Placeholder group chat text.",
    travelIck: "Placeholder travel ick.",
  },
};

// ── Helpers ──


function SectionHeader({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "PlayfairDisplay_700Bold",
        fontSize: 20,
        color: "#111827",
        marginBottom: 20,
      }}
    >
      {children}
    </Text>
  );
}

function BodyText({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: "Lora_400Regular",
        fontSize: 16,
        lineHeight: 26,
        color: "#1F2937",
        width: 320,
      }}
    >
      {children}
    </Text>
  );
}

function PartnerCard({ code, name, desc, align }: { code: string; name: string; desc: string; align?: "left" | "right" }) {
  const textAlign = align === "right" ? "right" : "left";
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontFamily: "Lora_500Medium",
          fontSize: 18,
          color: "#1A7D7A",
          textAlign,
        }}
      >
        {code} — {name}
      </Text>
      <Text
        style={{
          fontFamily: "Lora_400Regular",
          fontSize: 14,
          color: "#1F2937",
          marginTop: 8,
          textAlign,
        }}
      >
        {desc}
      </Text>
    </View>
  );
}

function DimensionSliderCard({
  left,
  right,
  color,
  value,
  explanation,
  expanded,
  onPress,
}: {
  left: string;
  right: string;
  color: string;
  value: number;
  explanation: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const winningLabel = value <= 50 ? left : right;
  const displayPercent = value <= 50 ? 100 - value : value;

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 16,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Track */}
        <View
          style={{
            height: 8,
            backgroundColor: color + "33",
            borderRadius: 4,
            overflow: "visible",
          }}
        >
          <View
            style={{
              width: `${value}%`,
              height: 8,
              backgroundColor: color,
              borderRadius: 4,
            }}
          />
          {/* Marker dot — colored fill, white border */}
          <View
            style={{
              position: "absolute",
              left: `${value}%`,
              top: -6,
              marginLeft: -10,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: color,
              borderWidth: 2,
              borderColor: "#FFFFFF",
            }}
          />
        </View>

        {/* Labels row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontFamily: "Lora_400Regular", fontSize: 12, color: "#4B5563" }}>
            {left}
          </Text>
          <Text style={{ fontFamily: "Lora_600SemiBold", fontSize: 14, color }}>
            {displayPercent}% {winningLabel}
          </Text>
          <Text style={{ fontFamily: "Lora_400Regular", fontSize: 12, color: "#4B5563" }}>
            {right}
          </Text>
        </View>

        {/* Accordion explanation */}
        {expanded && (
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              color: "#4B5563",
              marginTop: 12,
            }}
          >
            {explanation}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

// ── Screen ──

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TypeRevealScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isOnboarding = !mode || mode === "onboarding";
  const insets = useSafeAreaInsets();
  const bottomBarOpacity = useRef(new Animated.Value(0)).current;
  const isVisible = useRef(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [expandedSlider, setExpandedSlider] = useState<number | null>(null);
  const [typeResult, setTypeResult] = useState<TypeResult | null>(null);

  useEffect(() => {
    (async () => {
      const zero: DimensionScoreInput = { plan_flow: 0, busy_relaxed: 0, comfort_adventure: 0, immerse_observe: 0 };
      let swipeScores = zero;
      let dreamDayScores = zero;

      try {
        const swipeRaw = await AsyncStorage.getItem("journy_swipe_scores");
        if (swipeRaw) swipeScores = JSON.parse(swipeRaw);
      } catch {}

      try {
        const ddRaw = await AsyncStorage.getItem("journy_dreamday_scores");
        if (ddRaw) dreamDayScores = JSON.parse(ddRaw);
      } catch {}

      const result = calculateTravelerType(swipeScores, dreamDayScores);
      setTypeResult(result);

      // Save for later use
      AsyncStorage.setItem("journy_type_result", JSON.stringify(result));
      AsyncStorage.setItem("journy_type_color", result.groupColor);

      console.log("=== SCORING SUMMARY ===");
      console.log(`Swipe scores: PF:${swipeScores.plan_flow} BR:${swipeScores.busy_relaxed} CA:${swipeScores.comfort_adventure} IO:${swipeScores.immerse_observe}`);
      console.log(`Dream day scores: PF:${dreamDayScores.plan_flow} BR:${dreamDayScores.busy_relaxed} CA:${dreamDayScores.comfort_adventure} IO:${dreamDayScores.immerse_observe}`);
      const c = result.dimensions;
      console.log(`Combined: PF:${c.plan_flow.score} BR:${c.busy_relaxed.score} CA:${c.comfort_adventure.score} IO:${c.immerse_observe.score}`);
      console.log(`Poles: ${c.plan_flow.pole} ${c.busy_relaxed.pole} ${c.comfort_adventure.pole} ${c.immerse_observe.pole}`);
      console.log(`Type: ${result.code} — ${result.name}`);
      console.log(`Group color: ${result.groupColor}`);
      console.log(`Confidences: PF:${c.plan_flow.confidence}% BR:${c.busy_relaxed.confidence}% CA:${c.comfort_adventure.confidence}% IO:${c.immerse_observe.confidence}%`);
      console.log("========================");

    })();
  }, []);

  const toggleSlider = (index: number) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    );
    setExpandedSlider(expandedSlider === index ? null : index);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShow = y > 750;
    if (shouldShow !== isVisible.current) {
      isVisible.current = shouldShow;
      Animated.timing(bottomBarOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const t = typeResult;
  const revealColor = t?.groupColor || "#1A7D7A";
  const p = placeholderContent;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ===== SECTION 1: THE REVEAL ===== */}
        <View
          style={{
            height: Math.max(SCREEN_HEIGHT, 850),
            backgroundColor: revealColor,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: insets.top,
          }}
        >
          {/* Back arrow — only in view/updated mode */}
          {!isOnboarding && (
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              style={{
                position: "absolute",
                top: insets.top + 6,
                left: 20,
                padding: 8,
                zIndex: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 20,
                  color: "#FFFFFF",
                }}
              >
                ←
              </Text>
            </Pressable>
          )}
          <Text
            style={{
              fontFamily: "PlayfairDisplay_900Black",
              fontSize: 60,
              color: "#FFFFFF",
              letterSpacing: 5,
            }}
          >
            {t?.code || "..."}
          </Text>

          <Text
            style={{
              fontFamily: "PlayfairDisplay_900Black",
              fontSize: 24,
              color: "#FFFFFF",
              marginTop: 16,
            }}
          >
            {t?.name || "..."}
          </Text>

          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 16,
              lineHeight: 24,
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              width: 310,
              marginTop: 12,
            }}
          >
            {p.tagline}
          </Text>

          <View
            style={{
              width: 40,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.3)",
              marginTop: 32,
            }}
          />

          <Text
            style={{
              fontFamily: "Lora_500Medium",
              fontSize: 18,
              color: "#FFFFFF",
              marginTop: 32,
            }}
          >
            {t ? DIM_KEYS.map((k) => t.dimensions[k].pole).join(" · ") : "..."}
          </Text>

          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              marginTop: 8,
            }}
          >
            {t ? DIM_KEYS.map((k) => t.dimensions[k].label).join(" · ") : "..."}
          </Text>

          <Text
            style={{
              position: "absolute",
              bottom: 30,
              fontFamily: "Lora_400Regular",
              fontSize: 24,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            ∨
          </Text>
        </View>

        {/* Gradient transition */}
        <LinearGradient
          colors={[revealColor, "#FFFFFF"]}
          style={{ height: 80, width: "100%" }}
        />

        {/* ===== SECTION 2: THE BREAKDOWN ===== */}
        <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }}>
          {/* 2A: Dimension Sliders */}
          <Pressable onPress={() => setShowTooltip(false)} style={{ marginTop: 228, marginBottom: 160 }}>
            {/* Header with info icon */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "PlayfairDisplay_700Bold",
                  fontSize: 20,
                  color: "#111827",
                }}
              >
                Your Dimensions
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setShowTooltip(!showTooltip);
                }}
                style={{ marginLeft: 8 }}
              >
                <Text style={{ fontSize: 20, color: "#1A7D7A" }}>ⓘ</Text>
              </Pressable>
            </View>

            {/* Tooltip */}
            {showTooltip && (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 14,
                    color: "#1F2937",
                  }}
                >
                  Tap on a dimension to learn more about what it says about you.
                </Text>
              </View>
            )}

            {/* Slider cards */}
            <View style={{ gap: 12 }}>
              {DIM_KEYS.map((dimKey, i) => {
                const dimResult = t?.dimensions[dimKey];
                const sliderPos = dimResult ? scoreToSliderPosition(dimResult.score) : 50;
                return (
                  <DimensionSliderCard
                    key={i}
                    left={LEFT_LABELS[i]}
                    right={RIGHT_LABELS[i]}
                    color={SLIDER_COLORS[i]}
                    value={sliderPos}
                    explanation={SLIDER_EXPLANATIONS[i]}
                    expanded={expandedSlider === i}
                    onPress={() => toggleSlider(i)}
                  />
                );
              })}
            </View>
          </Pressable>

          {/* 2B: Description */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>{p.description.title}</SectionHeader>
            <Text
              style={{
                fontFamily: "Lora_500Medium",
                fontSize: 18,
                color: "#111827",
                width: 320,
                marginBottom: 16,
              }}
            >
              {p.description.pullQuote}
            </Text>
            {p.description.paragraphs.map((p, i) => (
              <View key={i} style={i > 0 ? { marginTop: 28 } : undefined}>
                <BodyText>{p}</BodyText>
              </View>
            ))}
          </View>

          {/* 2C: Role on the Trip — right-aligned */}
          <View style={{ marginTop: 84, alignItems: "flex-end" }}>
            <Text
              style={{
                fontFamily: "PlayfairDisplay_700Bold",
                fontSize: 20,
                color: "#111827",
                marginBottom: 20,
                textAlign: "right",
              }}
            >
              {p.role.title}
            </Text>
            {p.role.paragraphs.map((p, i) => (
              <View key={i} style={i > 0 ? { marginTop: 28 } : undefined}>
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 16,
                    lineHeight: 26,
                    color: "#1F2937",
                    width: 320,
                    textAlign: "right",
                  }}
                >
                  {p}
                </Text>
              </View>
            ))}
          </View>

          {/* 2D: Travel Partners */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>How You Travel With Others</SectionHeader>
            <Text
              style={{
                fontFamily: "Lora_500Medium",
                fontSize: 18,
                color: "#4B5563",
                marginBottom: 12,
              }}
            >
              Best travel partners
            </Text>
            <View style={{ gap: 12 }}>
              {p.partners.best.map((p, i) => (
                <PartnerCard key={`best-${i}`} code={p.code} name={p.name} desc={p.description} />
              ))}
            </View>

            <View style={{ alignItems: "flex-end", marginTop: 24 }}>
              <Text
                style={{
                  fontFamily: "Lora_500Medium",
                  fontSize: 18,
                  color: "#4B5563",
                  marginBottom: 12,
                  textAlign: "right",
                }}
              >
                Might butt heads with
              </Text>
              <View style={{ gap: 12, width: "100%" }}>
                {p.partners.discourse.map((p, i) => (
                  <PartnerCard key={`disc-${i}`} code={p.code} name={p.name} desc={p.description} align="right" />
                ))}
              </View>
            </View>
          </View>

          {/* Traveler Red Flag */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>Traveler Red Flag</SectionHeader>
            <Text style={{ fontFamily: "Lora_400Regular", fontSize: 14, color: "#4B5563" }}>
              {p.redFlag}
            </Text>
          </View>

          {/* Packing Style */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>Packing Style</SectionHeader>
            <Text style={{ fontFamily: "Lora_400Regular", fontSize: 14, color: "#4B5563" }}>
              {p.funFacts.packingStyle}
            </Text>
          </View>

          {/* Favorite Text in the Group Chat */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>Favorite Text in the Group Chat</SectionHeader>
            <Text style={{ fontFamily: "Lora_400Regular", fontSize: 14, color: "#4B5563" }}>
              "{p.funFacts.groupChat}"
            </Text>
          </View>

          {/* Travel Ick */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>Travel Ick</SectionHeader>
            <Text style={{ fontFamily: "Lora_400Regular", fontSize: 14, color: "#4B5563" }}>
              {p.funFacts.travelIck}
            </Text>
          </View>

          {/* Recommended Destinations */}
          <View style={{ marginTop: 84 }}>
            <SectionHeader>Recommended Destinations</SectionHeader>
            <View style={{ gap: 12 }}>
              {p.funFacts.destinations.split(", ").map((city) => (
                <View
                  key={city}
                  style={{
                    height: 80,
                    backgroundColor: "#F3F4F6",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lora_600SemiBold",
                      fontSize: 16,
                      color: "#111827",
                    }}
                  >
                    {city}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom spacing for floating button */}
          <View style={{ height: 140 + insets.bottom }} />
        </View>
      </ScrollView>

      {/* Floating button — fades in after scrolling past teal */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: insets.bottom + 16,
          left: 20,
          right: 20,
          opacity: bottomBarOpacity,
        }}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={() =>
            router.push(isOnboarding ? "/(auth)/signup" : "/(tabs)/profile")
          }
          style={{
            backgroundColor: "#1A7D7A",
            height: 52,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "Lora_600SemiBold",
              fontSize: 16,
              color: "#FFFFFF",
            }}
          >
            {isOnboarding ? "Create Account to Save Results" : "Back to Profile"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
