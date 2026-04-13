import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SwipeIntroScreen() {
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
        }}
      >
        <View
          style={{
            width: 2,
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
        What kind of traveler are you?
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontFamily: "Lora_400Regular",
          fontSize: 16,
          lineHeight: 24,
          color: "#4B5563",
          textAlign: "center",
          width: 282,
          alignSelf: "center",
          marginTop: 22,
        }}
      >
        Swipe right on the cards that feel like you, left on the ones that
        don't.
      </Text>

      {/* Flex spacer */}
      <View style={{ flex: 1 }} />

      {/* CTA Button */}
      <Pressable
        onPress={() => router.push("/(onboarding)/swipe-cards")}
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
          Let's go
        </Text>
      </Pressable>
    </View>
  );
}
