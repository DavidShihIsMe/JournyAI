import { View, Text, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../assets/welcome-bg.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.80)"]}
          locations={[0, 0.5, 0.85]}
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingTop: insets.top + 94,
              paddingBottom: insets.bottom + 80,
              paddingHorizontal: 20,
            }}
          >
            {/* Logo + tagline */}
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "PlayfairDisplay_900Black",
                  fontSize: 36,
                  letterSpacing: 1.44,
                  color: "#000000",
                }}
              >
                Journy
              </Text>
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 14,
                  lineHeight: 21,
                  color: "#000000",
                  marginTop: 10,
                }}
              >
                Travel like yourself, not like your feed
              </Text>
            </View>

            {/* Bottom section */}
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 12,
                  lineHeight: 17,
                  color: "#FFFFFF",
                  opacity: 0.8,
                  textAlign: "center",
                  marginBottom: 11,
                }}
              >
                By continuing, you agree to our{"\n"}
                <Text
                  style={{ fontFamily: "Lora_600SemiBold" }}
                  onPress={() => {}}
                >
                  Terms of Service
                </Text>
                {" "}and{" "}
                <Text
                  style={{ fontFamily: "Lora_600SemiBold" }}
                  onPress={() => {}}
                >
                  Privacy Policy
                </Text>
                .
              </Text>

              <Pressable
                onPress={() => router.push("/(onboarding)/swipe-intro")}
                style={{
                  backgroundColor: "#1A7D7A",
                  width: "100%",
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
                  Find your travel style
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(auth)/login")}
                style={{ marginTop: 11, paddingVertical: 8 }}
              >
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 14,
                    lineHeight: 21,
                    color: "#FFFFFF",
                  }}
                >
                  Already have an account?{" "}
                  <Text style={{ fontFamily: "Lora_600SemiBold" }}>
                    Sign in
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
