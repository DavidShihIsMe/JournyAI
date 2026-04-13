import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InterestsIntroScreen() {
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
            width: "75%",
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
          width: 310,
          alignSelf: "center",
        }}
      >
        One more thing
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontFamily: "Lora_400Regular",
          fontSize: 16,
          lineHeight: 24,
          color: "#4B5563",
          textAlign: "center",
          width: 310,
          alignSelf: "center",
          marginTop: 16,
        }}
      >
        Now that we know how you like to travel, let's figure out what you like
        to do.
      </Text>

      {/* Flex spacer */}
      <View style={{ flex: 1 }} />

      {/* CTA Button */}
      <Pressable
        onPress={() => router.push("/(onboarding)/interests")}
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
          Almost there
        </Text>
      </Pressable>

      {/* Retake link */}
      <Pressable
        onPress={() => {
          AsyncStorage.removeItem("journy_dreamday_scores");
          console.log("Cleared dream day scores, restarting dream day");
          router.push("/(onboarding)/dream-day");
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
          Redo travel quiz
        </Text>
      </Pressable>
    </View>
  );
}
