import { useState, useMemo, useEffect, useRef } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Animated } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INTERESTS, POPULAR_INTERESTS } from "@lib/constants/interests";

export default function InterestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const hasSelection = selected.size > 0;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(btnAnim, {
      toValue: hasSelection ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [hasSelection]);

  const btnBg = btnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#E5E7EB", "#1A7D7A"],
  });
  const btnTextColor = btnAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#9CA3AF", "#FFFFFF"],
  });

  const displayedInterests = useMemo(() => {
    if (!search.trim()) {
      // Show popular first, then remaining interests
      const rest = INTERESTS.filter((i) => !POPULAR_INTERESTS.includes(i));
      return [...POPULAR_INTERESTS, ...rest];
    }
    const q = search.trim().toLowerCase();
    return INTERESTS.filter((i) => i.toLowerCase().includes(q));
  }, [search]);

  const toggleChip = (interest: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) next.delete(interest);
      else next.add(interest);
      return next;
    });
  };

  const handleContinue = () => {
    console.log("Selected interests:", Array.from(selected));
    router.push("/(onboarding)/type-reveal");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 31,
          paddingBottom: insets.bottom + 78,
        }}
      >
        {/* Progress bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 41 }}>
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
                width: "80%",
                height: 4,
                backgroundColor: "#1A7D7A",
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Fixed header: headline, subtitle, search */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: "PlayfairDisplay_700Bold",
              fontSize: 24,
              lineHeight: 29,
              color: "#111827",
            }}
          >
            What are you into?
          </Text>

          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              lineHeight: 21,
              color: "#4B5563",
              marginTop: 8,
            }}
          >
            Pick as many as you want, you can always change these later.
          </Text>

          <View
            style={{
              height: 44,
              backgroundColor: "#F3F4F6",
              borderRadius: 22,
              justifyContent: "center",
              paddingHorizontal: 20,
              marginTop: 20,
            }}
          >
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search interests..."
              placeholderTextColor="#9CA3AF"
              style={{
                fontFamily: "Lora_400Regular",
                fontSize: 14,
                color: "#111827",
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* Scrollable chip grid */}
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 16,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {displayedInterests.map((interest) => {
            const isSelected = selected.has(interest);
            return (
              <Pressable
                key={interest}
                onPress={() => toggleChip(interest)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isSelected ? "#1A7D7A" : "transparent",
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 14,
                    lineHeight: 21,
                    color: isSelected ? "#FFFFFF" : "#1F2937",
                  }}
                >
                  {interest}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Bottom section */}
        <View
          style={{
            paddingHorizontal: 20,
            backgroundColor: "#FAFAFA",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            paddingTop: 14,
          }}
        >
          {/* Selected count */}
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              lineHeight: 21,
              color: "#111827",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Selected: {selected.size}
          </Text>

          {/* Continue button */}
          <Pressable
            onPress={hasSelection ? handleContinue : undefined}
            disabled={!hasSelection}
          >
            <Animated.View
              style={{
                backgroundColor: btnBg,
                height: 52,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Animated.Text
                style={{
                  fontFamily: "Lora_600SemiBold",
                  fontSize: 16,
                  color: btnTextColor,
                }}
              >
                See Your Traveler Type
              </Animated.Text>
            </Animated.View>
          </Pressable>

          {/* Skip */}
          <Pressable
            onPress={() => router.push("/(onboarding)/type-reveal")}
            style={{
              marginTop: 19,
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "Lora_400Regular",
                fontSize: 14,
                lineHeight: 21,
                color: "#9CA3AF",
              }}
            >
              Skip
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
