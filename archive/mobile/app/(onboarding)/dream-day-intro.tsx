import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DreamDayIntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top + 31,
        paddingBottom: insets.bottom + 118,
        paddingHorizontal: 20,
      }}
    >
      <StatusBar style="dark" />

      {/* Progress bar */}
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
            width: "40%",
            height: 4,
            backgroundColor: "#1A7D7A",
            borderRadius: 2,
          }}
        />
      </View>

      {/* Spacer from progress bar to headline */}
      <View style={{ height: 112 }} />

      {/* Headline */}
      <Text
        style={{
          fontFamily: "PlayfairDisplay_400Regular",
          fontSize: 32,
          lineHeight: 38,
          color: "#111827",
          textAlign: "center",
          width: 331,
          alignSelf: "center",
        }}
      >
        What does your dream day look like?
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontFamily: "Lora_400Regular",
          fontSize: 16,
          lineHeight: 24,
          color: "#4B5563",
          textAlign: "center",
          width: 322,
          alignSelf: "center",
          marginTop: 22,
        }}
      >
        Pick your way through a perfect travel day, there is no wrong answer.
      </Text>

      {/* Flex spacer */}
      <View style={{ flex: 1 }} />

      {/* CTA Button */}
      <Pressable
        onPress={() => router.push("/(onboarding)/dream-day")}
        style={{
          backgroundColor: "#1A7D7A",
          height: 52,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Lora_600SemiBold",
            fontSize: 16,
            color: "#FFFFFF",
          }}
        >
          Start
        </Text>
      </Pressable>

      {/* Retake link */}
      <Pressable
        onPress={() => {
          AsyncStorage.removeItem("journy_swipe_scores");
          console.log("Cleared swipe card scores, restarting swipe cards");
          router.push("/(onboarding)/swipe-cards");
        }}
        style={{ marginTop: 16, alignItems: "center", paddingVertical: 4 }}
      >
        <Text
          style={{
            fontFamily: "Lora_400Regular",
            fontSize: 14,
            color: "#9CA3AF",
          }}
        >
          Redo swipe cards
        </Text>
      </Pressable>
    </View>
  );
}
