import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Svg, { Path } from "react-native-svg";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which fields have been touched (blurred)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const hasContent = name.trim().length > 0 && email.trim().length > 0 && password.length > 0;

  const nameError =
    touched.name && name.trim().length > 0 && name.trim().length < 2
      ? "Name must be at least 2 characters"
      : touched.name && name.trim().length === 0
        ? "Name is required"
        : null;

  const emailError =
    touched.email && email.trim().length > 0 && !validateEmail(email.trim())
      ? "Enter a valid email address"
      : touched.email && email.trim().length === 0
        ? "Email is required"
        : null;

  const passwordError =
    touched.password && password.length > 0 && password.length < 8
      ? "Password must be at least 8 characters"
      : touched.password && password.length === 0
        ? "Password is required"
        : null;

  const handleCreateAccount = useCallback(async () => {
    // Touch all fields to show errors
    setTouched({ name: true, email: true, password: true });

    const trimmedName = name.trim();
    if (
      trimmedName.length < 2 ||
      !validateEmail(email.trim()) ||
      password.length < 8
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Supabase Dashboard > Auth > Settings > Enable email confirmations must be turned on
      // TODO: Replace with actual Supabase auth:
      // const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      // if (error) throw error;
      // await supabase.from('profiles').update({ display_name: trimmedName }).eq('user_id', user.id);
      console.log("Creating account:", { name: trimmedName, email: email.trim() });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({
        pathname: "/(auth)/verify-email",
        params: { email: email.trim() },
      });
    } catch {
      setError("Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  }, [name, email, password, router]);

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
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
                Create Account
              </Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Content */}
            <View style={{ paddingHorizontal: 20 }}>
              {/* Headline */}
              <Text
                style={{
                  fontFamily: "Lora_500Medium",
                  fontSize: 18,
                  lineHeight: 23,
                  color: "#111827",
                  marginTop: 22,
                }}
              >
                Welcome to Journy
              </Text>

              {/* Subtitle */}
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 14,
                  lineHeight: 21,
                  color: "#4B5563",
                  marginTop: 8,
                }}
              >
                Create an account to start planning your trip
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

              {/* Form */}
              <View style={{ marginTop: 16, gap: 16 }}>
                {/* Name input */}
                <View>
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 14,
                      lineHeight: 21,
                      color: "#1F2937",
                      marginBottom: 8,
                    }}
                  >
                    What is your name?
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    placeholder="First Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    style={{
                      height: 48,
                      backgroundColor: "#F3F4F6",
                      borderWidth: 1,
                      borderColor: nameError ? "#EF4444" : "#E5E7EB",
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      fontFamily: "Lora_400Regular",
                      fontSize: 16,
                      color: "#111827",
                    }}
                  />
                  {nameError && (
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 12,
                        color: "#EF4444",
                        marginTop: 4,
                      }}
                    >
                      {nameError}
                    </Text>
                  )}
                </View>

                {/* Email input */}
                <View>
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
                    onChangeText={setEmail}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
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

                {/* Password input */}
                <View>
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 14,
                      lineHeight: 21,
                      color: "#1F2937",
                      marginBottom: 8,
                    }}
                  >
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    placeholder="Create your password (8+ characters)"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    autoCapitalize="none"
                    style={{
                      height: 48,
                      backgroundColor: "#F3F4F6",
                      borderWidth: 1,
                      borderColor: passwordError ? "#EF4444" : "#E5E7EB",
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      fontFamily: "Lora_400Regular",
                      fontSize: 16,
                      color: "#111827",
                    }}
                  />
                  {passwordError && (
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 12,
                        color: "#EF4444",
                        marginTop: 4,
                      }}
                    >
                      {passwordError}
                    </Text>
                  )}
                </View>
              </View>

              {/* Create Account button */}
              <Pressable
                onPress={handleCreateAccount}
                disabled={!hasContent || loading}
                style={{
                  backgroundColor: hasContent ? "#1A7D7A" : "#E5E7EB",
                  height: 52,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 24,
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
                    Create Account
                  </Text>
                )}
              </Pressable>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 24,
                }}
              >
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "#9CA3AF" }}
                />
                <Text
                  style={{
                    fontFamily: "Lora_400Regular",
                    fontSize: 14,
                    color: "#9CA3AF",
                    marginHorizontal: 16,
                  }}
                >
                  or
                </Text>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: "#9CA3AF" }}
                />
              </View>

              {/* OAuth buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 24,
                  marginTop: 24,
                }}
              >
                <Pressable
                  onPress={() => console.log("Facebook OAuth")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="facebook" size={24} color="#1877F2" />
                </Pressable>

                <Pressable
                  onPress={() => console.log("Apple OAuth")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome name="apple" size={24} color="#000000" />
                </Pressable>

                <Pressable
                  onPress={() => console.log("Google OAuth")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Svg width={22} height={22} viewBox="0 0 48 48">
                    <Path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107" />
                    <Path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00" />
                    <Path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50" />
                    <Path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2" />
                  </Svg>
                </Pressable>
              </View>

              {/* Sign in link */}
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
                  Already have an account?{" "}
                  <Text style={{ color: "#1A7D7A" }}>Sign in</Text>
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
