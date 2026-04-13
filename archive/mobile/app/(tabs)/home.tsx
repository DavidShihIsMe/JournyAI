import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TypeData {
  code: string;
  name: string;
  groupColor: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState<string | null>(null);
  const [typeData, setTypeData] = useState<TypeData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const name = await AsyncStorage.getItem("journy_user_name");
        if (name) setUserName(name);
      } catch {}

      try {
        const raw = await AsyncStorage.getItem("journy_type_result");
        if (raw) {
          const result = JSON.parse(raw);
          setTypeData({
            code: result.code,
            name: result.name,
            groupColor: result.groupColor,
          });
        }
      } catch {}
    })();
  }, []);

  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      {/* Top bar */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontFamily: "PlayfairDisplay_700Bold",
            fontSize: 20,
            color: "#111827",
          }}
        >
          Journy
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable onPress={() => console.log("Notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#4B5563" />
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lora_400Regular",
                fontSize: 12,
                color: "#111827",
              }}
            >
              {initial}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text
          style={{
            fontFamily: "PlayfairDisplay_700Bold",
            fontSize: 24,
            color: "#000000",
            marginTop: 16,
          }}
        >
          Welcome back, {userName || "there"}
        </Text>

        {/* Type identity row */}
        {typeData && (
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <View
              style={{
                backgroundColor: typeData.groupColor,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "PlayfairDisplay_700Bold",
                  fontSize: 24,
                  color: "#FFFFFF",
                }}
              >
                {typeData.code}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "PlayfairDisplay_400Regular",
                fontSize: 24,
                color: "#000000",
                marginLeft: 8,
              }}
            >
              {typeData.name}
            </Text>
          </Pressable>
        )}

        {/* Invite friends card */}
        <View
          style={{
            marginTop: 32,
            backgroundColor: "#E6F5F4",
            borderWidth: 1.5,
            borderColor: "#D1D5DB",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Lora_500Medium",
              fontSize: 16,
              color: "#1A7D7A",
            }}
          >
            You have 5 invites left!
          </Text>
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              color: "#4B5563",
              marginTop: 8,
            }}
          >
            Invite your friends to see your travel compatibility and to plan
            trips together.
          </Text>
          <Pressable
            onPress={() => console.log("Invite friend")}
            style={{
              backgroundColor: "#1A7D7A",
              height: 52,
              borderRadius: 12,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Lora_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Invite Your Friends
            </Text>
          </Pressable>
        </View>

        {/* Your Trips */}
        <Text
          style={{
            fontFamily: "Lora_500Medium",
            fontSize: 18,
            color: "#000000",
            marginTop: 32,
          }}
        >
          Your Trips
        </Text>

        {/* Plan trip card */}
        <Pressable
          onPress={() => router.push("/(tabs)/plan")}
          style={{
            marginTop: 12,
            height: 122,
            backgroundColor: "#F3F4F6",
            borderWidth: 1.5,
            borderColor: "#E5E7EB",
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "PlayfairDisplay_700Bold",
              fontSize: 24,
              color: "#000000",
            }}
          >
            +
          </Text>
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 14,
              color: "#9CA3AF",
              marginTop: 8,
            }}
          >
            Plan your first trip
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
