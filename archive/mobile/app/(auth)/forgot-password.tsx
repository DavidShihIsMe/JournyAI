import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const hasContent = email.trim().length > 0;

  const emailError =
    touched && email.trim().length > 0 && !validateEmail(email.trim())
      ? "Enter a valid email address"
      : touched && email.trim().length === 0
        ? "Email is required"
        : null;

  const handleSend = useCallback(async () => {
    setTouched(true);
    if (!validateEmail(email.trim())) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Supabase call:
      // await supabase.auth.resetPasswordForEmail(email.trim());
      console.log("Sending reset link to:", email.trim());
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 40,
            }}
          >
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
                Forgot Password
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
              {sent ? (
                <>
                  {/* Success state */}
                  <Text
                    style={{
                      fontFamily: "Lora_500Medium",
                      fontSize: 18,
                      lineHeight: 23,
                      color: "#111827",
                      marginTop: 22,
                    }}
                  >
                    Check your email
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 16,
                      lineHeight: 24,
                      color: "#4B5563",
                      marginTop: 8,
                      width: 320,
                    }}
                  >
                    If an account exists for that email, we sent a password
                    reset link. It may take a few minutes.
                  </Text>
                </>
              ) : (
                <>
                  {/* Form state */}
                  <Text
                    style={{
                      fontFamily: "Lora_500Medium",
                      fontSize: 18,
                      lineHeight: 23,
                      color: "#111827",
                      marginTop: 22,
                    }}
                  >
                    Reset Your Password
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
                    Enter your email and we will send you a reset link.
                  </Text>

                  {/* Error banner */}
                  {error && (
                    <View
                      style={{
                        backgroundColor: "#FEF2F2",
                        borderRadius: 12,
                        padding: 16,
                        marginTop: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lora_400Regular",
                          fontSize: 14,
                          color: "#EF4444",
                        }}
                      >
                        {error}
                      </Text>
                    </View>
                  )}

                  {/* Email input */}
                  <View style={{ marginTop: 32 }}>
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 14,
                        lineHeight: 21,
                        color: "#1F2937",
                        marginBottom: 8,
                      }}
                    >
                      Email
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={(t) => {
                        setEmail(t);
                        if (error) setError(null);
                      }}
                      onBlur={() => setTouched(true)}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{
                        height: 48,
                        backgroundColor: "#F3F4F6",
                        borderWidth: 1,
                        borderColor: emailError ? "#EF4444" : "#E5E7EB",
                        borderRadius: 10,
                        paddingHorizontal: 16,
                        fontFamily: "Lora_400Regular",
                        fontSize: 16,
                        color: "#111827",
                      }}
                    />
                    {emailError && (
                      <Text
                        style={{
                          fontFamily: "Lora_400Regular",
                          fontSize: 12,
                          color: "#EF4444",
                          marginTop: 4,
                        }}
                      >
                        {emailError}
                      </Text>
                    )}
                  </View>
                </>
              )}

              {/* Spacer */}
              <View style={{ flex: 1 }} />

              {/* Send Reset Link / hidden in success state */}
              {!sent && (
                <Pressable
                  onPress={handleSend}
                  disabled={!hasContent || loading}
                  style={{
                    backgroundColor: hasContent ? "#1A7D7A" : "#E5E7EB",
                    height: 52,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Lora_600SemiBold",
                        fontSize: 16,
                        color: hasContent ? "#FFFFFF" : "#9CA3AF",
                      }}
                    >
                      Send Reset Link
                    </Text>
                  )}
                </Pressable>
              )}

              {/* Back to sign in */}
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                style={{
                  alignItems: "center",
                  marginTop: 24,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 14,
                    lineHeight: 21,
                    color: "#4B5563",
                  }}
                >
                  Back to{" "}
                  <Text style={{ color: "#1A7D7A" }}>sign in</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}
