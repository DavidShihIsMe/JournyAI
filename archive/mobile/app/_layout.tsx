import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_900Black,
} from "@expo-google-fonts/playfair-display";
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
} from "@expo-google-fonts/lora";

import "../global.css";

SplashScreen.preventAutoHideAsync();

// Force the initial route to always be the Welcome screen
export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_900Black,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
  });

  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Always start on the welcome screen on fresh load/refresh
  useEffect(() => {
    if (fontsLoaded && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/");
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="(onboarding)"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
