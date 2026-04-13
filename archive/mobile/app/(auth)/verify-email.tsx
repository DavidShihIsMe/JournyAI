import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const displayEmail = email || "your email";

  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown > 0]);

  // Listen for auth state change (email verified)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "SIGNED_IN" &&
          session?.user?.email_confirmed_at
        ) {
          // Email verified — navigate forward
          // TODO: check if user has quiz data to decide destination
          router.replace("/(tabs)/home");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || !email) return;

    try {
      // TODO: Replace with actual Supabase resend
      // await supabase.auth.resend({ type: "signup", email });
      console.log("Resending verification email to:", email);

      setCooldown(60);
      setResendMessage("Email sent!");
      setTimeout(() => setResendMessage(null), 3000);
    } catch {
      setResendMessage("Failed to resend. Try again.");
      setTimeout(() => setResendMessage(null), 3000);
    }
  }, [cooldown, email]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top,
      }}
    >
      <StatusBar style="dark" />

      {/* Top bar */}
      <View
        style={{
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ width: 24 }}>
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 16,
              lineHeight: 24,
              color: "#111827",
            }}
          >
            ←
          </Text>
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontFamily: "Lora_500Medium",
            fontSize: 18,
            lineHeight: 23,
            color: "#111827",
            textAlign: "center",
          }}
        >
          Email Verification
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Headline + subtitle */}
      <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
        <Text
          style={{
            fontFamily: "Lora_500Medium",
            fontSize: 18,
            lineHeight: 23,
            color: "#111827",
          }}
        >
          Check Your Inbox
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
          Make sure to check your spam inbox just in case.
        </Text>
      </View>

      {/* Centered email + resend */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Lora_400Regular",
            fontSize: 14,
            lineHeight: 21,
            color: "#4B5563",
            textAlign: "center",
          }}
        >
          We sent a verification email to
        </Text>
        <Text
          style={{
            fontFamily: "Lora_600SemiBold",
            fontSize: 14,
            lineHeight: 21,
            color: "#111827",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {displayEmail}
        </Text>

        {/* Resend link */}
        <View style={{ flexDirection: "row", marginTop: 24 }}>
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              lineHeight: 21,
              color: "#4B5563",
            }}
          >
            Didn't get it?{" "}
          </Text>
          <Pressable onPress={handleResend} disabled={cooldown > 0}>
            <Text
              style={{
                fontFamily: "Lora_400Regular",
                fontSize: 14,
                lineHeight: 21,
                color: cooldown > 0 ? "#9CA3AF" : "#1A7D7A",
              }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
            </Text>
          </Pressable>
        </View>

        {/* Resend success message */}
        {resendMessage && (
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              lineHeight: 21,
              color: "#1A7D7A",
              marginTop: 8,
            }}
          >
            {resendMessage}
          </Text>
        )}
      </View>

      {/* Back to Sign In button */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 50,
        }}
      >
        <Pressable
          onPress={() => router.push("/(auth)/login")}
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
            Back to Sign in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
