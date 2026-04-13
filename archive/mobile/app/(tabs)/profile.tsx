import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
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

interface Activity {
  title: string;
  subtitle: string;
  completed: boolean;
  time?: string;
  route?: string;
  comingSoon?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("there");
  const [typeData, setTypeData] = useState<TypeData | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [hasSwipeScores, setHasSwipeScores] = useState(false);
  const [hasDreamDayScores, setHasDreamDayScores] = useState(false);

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
          setTypeData({ code: result.code, name: result.name, groupColor: result.groupColor });
        }
      } catch {}

      try {
        const raw = await AsyncStorage.getItem("journy_interests");
        if (raw) setInterests(JSON.parse(raw));
      } catch {}

      const swipe = await AsyncStorage.getItem("journy_swipe_scores");
      setHasSwipeScores(!!swipe);
      const dd = await AsyncStorage.getItem("journy_dreamday_scores");
      setHasDreamDayScores(!!dd);
    })();
  }, []);

  const initial = userName.charAt(0).toUpperCase();

  const activities: Activity[] = [
    {
      title: "Activity Cards",
      subtitle: "Swipe right or left on cards that match your vibe.",
      completed: hasSwipeScores,
      route: "/(onboarding)/swipe-cards",
    },
    {
      title: "This-or-That",
      subtitle: 'Answer a few "would-you-rather" questions in specific scenarios.',
      completed: hasDreamDayScores,
      route: "/(onboarding)/dream-day",
    },
    {
      title: "Questionnaire",
      subtitle: "Swipe right or left on cards that match your vibe.",
      completed: false,
      comingSoon: true,
    },
    {
      title: "Rate Your Last Trip",
      subtitle: "Let us know about how your last trip went and we can adjust your travel style for your next one.",
      completed: false,
      comingSoon: true,
    },
    {
      title: "Describe Your Favorite Trip",
      subtitle: "Let us know what your favorite trip was and what made it memorable.",
      completed: false,
      comingSoon: true,
    },
    {
      title: "Travel Preferences",
      subtitle: "Morning person? Like to skip breakfast?",
      completed: false,
      comingSoon: true,
    },
  ];

  const handleActivityTap = (activity: Activity) => {
    const nav = () =>
      router.push({
        pathname: activity.route as any,
        params: { source: "profile" },
      });

    if (activity.completed && activity.route) {
      Alert.alert(
        "Redo Activity",
        "This may change your traveler type. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Redo", onPress: nav },
        ]
      );
    } else if (activity.route) {
      nav();
    } else {
      console.log(`Open ${activity.title}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      {/* Top bar */}
      <View
        style={{
          paddingTop: insets.top,
          paddingBottom: 12,
          paddingHorizontal: 20,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Lora_500Medium",
            fontSize: 18,
            color: "#111827",
          }}
        >
          Profile
        </Text>
        <Pressable
          onPress={() => console.log("Settings")}
          style={{ position: "absolute", right: 20, bottom: 12 }}
        >
          <Ionicons name="settings-outline" size={24} color="#4B5563" />
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity section */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          {/* Avatar + name row */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#F3F4F6",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 20,
                  color: "#9CA3AF",
                }}
              >
                {initial}
              </Text>
            </View>

            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontFamily: "Lora_500Medium",
                  fontSize: 18,
                  color: "#111827",
                }}
              >
                {userName}
              </Text>

              {typeData && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                  <View
                    style={{
                      backgroundColor: typeData.groupColor,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lora_600SemiBold",
                        fontSize: 12,
                        color: "#FFFFFF",
                      }}
                    >
                      {typeData.code}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 14,
                      color: "#4B5563",
                      marginLeft: 8,
                    }}
                  >
                    {typeData.name}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* View Full Profile + Share row */}
          <View style={{ flexDirection: "row", marginTop: 20, gap: 8 }}>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(onboarding)/type-reveal",
                  params: { mode: "view" },
                })
              }
              style={{
                flex: 1,
                backgroundColor: "#1A7D7A",
                height: 44,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Lora_600SemiBold",
                  fontSize: 14,
                  color: "#FFFFFF",
                }}
              >
                View Full Profile
              </Text>
            </Pressable>
            <Pressable
              onPress={() => console.log("Share type")}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                backgroundColor: "#1A7D7A",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Keep Exploring section */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <Text
            style={{
              fontFamily: "PlayfairDisplay_700Bold",
              fontSize: 20,
              color: "#111827",
            }}
          >
            Keep Exploring
          </Text>
          <Text
            style={{
              fontFamily: "Lora_400Regular",
              fontSize: 12,
              color: "#9CA3AF",
              marginTop: 8,
            }}
          >
            Increase our confidence in your traveler type through these short
            activities. Completing these activities may update your traveler
            type.
          </Text>

          {/* Activity cards */}
          <View style={{ marginTop: 16, gap: 12 }}>
            {activities.map((activity) => {
              if (activity.comingSoon) {
                return (
                  <View
                    key={activity.title}
                    style={{
                      borderRadius: 12,
                      padding: 16,
                      backgroundColor: "#FFFFFF",
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      opacity: 0.5,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Lora_600SemiBold",
                          fontSize: 14,
                          color: "#111827",
                        }}
                      >
                        {activity.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lora_400Regular",
                          fontSize: 12,
                          color: "#4B5563",
                          marginTop: 4,
                        }}
                      >
                        {activity.subtitle}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 12,
                        color: "#9CA3AF",
                        marginLeft: 12,
                        marginTop: 2,
                      }}
                    >
                      Coming Soon
                    </Text>
                  </View>
                );
              }

              return (
                <Pressable
                  key={activity.title}
                  onPress={() => handleActivityTap(activity)}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    backgroundColor: activity.completed ? "#E6F5F4" : "#FFFFFF",
                    borderWidth: activity.completed ? 1.5 : 1,
                    borderColor: activity.completed ? "#1A7D7A" : "#E5E7EB",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Lora_600SemiBold",
                        fontSize: 14,
                        color: "#111827",
                      }}
                    >
                      {activity.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 12,
                        color: "#4B5563",
                        marginTop: 4,
                      }}
                    >
                      {activity.subtitle}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Lora_400Regular",
                        fontSize: 12,
                        color: "#1A7D7A",
                        marginTop: 4,
                      }}
                    >
                      {activity.completed ? "Tap to redo" : `Est. ${activity.time}`}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 12, marginTop: 2 }}>
                    {activity.completed ? (
                      <Ionicons name="checkmark" size={20} color="#1A7D7A" />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Interests section */}
        <View style={{ paddingHorizontal: 20, marginTop: 48 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "PlayfairDisplay_700Bold",
                fontSize: 20,
                color: "#111827",
              }}
            >
              Interests
            </Text>
            <Pressable onPress={() => console.log("Edit interests")}>
              <Text
                style={{
                  fontFamily: "Lora_400Regular",
                  fontSize: 14,
                  color: "#9CA3AF",
                }}
              >
                Edit Your Interests
              </Text>
            </Pressable>
          </View>

          {interests.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                rowGap: 10,
                marginTop: 16,
              }}
            >
              {interests.map((interest) => (
                <View
                  key={interest}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 14,
                      color: "#1F2937",
                    }}
                  >
                    {interest}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text
              style={{
                fontFamily: "Lora_400Regular",
                fontSize: 14,
                color: "#9CA3AF",
                marginTop: 16,
              }}
            >
              No interests selected
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
