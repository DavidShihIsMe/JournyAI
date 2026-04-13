import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateTravelerType, type DimensionScoreInput } from "@lib/onboarding/typeCalculator";
import {
  fixedSteps,
  dynamicSteps,
  getWeakestDimensions,
  type DimensionKey,
  type DreamDayStep,
} from "@lib/onboarding/dreamDaySteps";

const ALL_DIMS: DimensionKey[] = [
  "plan_flow",
  "busy_relaxed",
  "comfort_adventure",
  "immerse_observe",
];

export default function DreamDayScreen() {
  const router = useRouter();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const isFromProfile = source === "profile";
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<DimensionKey, number>>({
    plan_flow: 0,
    busy_relaxed: 0,
    comfort_adventure: 0,
    immerse_observe: 0,
  });
  // Store which dynamic dimensions were picked for steps 5 and 6
  const [dynamicDims, setDynamicDims] = useState<[DimensionKey, DimensionKey] | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progressPercent = 41 + (currentStep / 5) * 31;

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // Build the 6-step sequence: 4 fixed + 2 dynamic
  const allSteps: DreamDayStep[] = useMemo(() => {
    const steps = [...fixedSteps];
    if (dynamicDims) {
      steps.push(dynamicSteps[dynamicDims[0]][0]); // step 5
      steps.push(dynamicSteps[dynamicDims[1]][1]); // step 6
    } else {
      // Before step 4 is completed, use placeholders (won't be shown yet)
      steps.push(dynamicSteps.plan_flow[0]);
      steps.push(dynamicSteps.busy_relaxed[1]);
    }
    return steps;
  }, [dynamicDims]);

  const step = allSteps[currentStep];

  const goToStep = useCallback(
    (newStep: number) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(newStep);
        setSelectedIndex(null);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim]
  );

  const handleCardPress = useCallback(
    (choiceIndex: number) => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);

      setSelectedIndex(choiceIndex);

      scaleAnim.setValue(1);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      advanceTimerRef.current = setTimeout(async () => {
        const choice = allSteps[currentStep].choices[choiceIndex];
        const dim = allSteps[currentStep].dimension;

        const newScores = { ...scores, [dim]: scores[dim] + choice.score };
        setScores(newScores);

        console.log(
          `Dream Day Step ${currentStep + 1}: Choice ${choiceIndex + 1}. Dimension: ${dim}. Score added: ${choice.score}. Running totals: PF:${newScores.plan_flow} BR:${newScores.busy_relaxed} CA:${newScores.comfort_adventure} IO:${newScores.immerse_observe}`
        );

        // After step 4 (index 3), determine dynamic steps
        if (currentStep === 3) {
          const [weakest, secondWeakest] = getWeakestDimensions(newScores);
          setDynamicDims([weakest, secondWeakest]);
          console.log(
            `Weakest dimensions after step 4: ${weakest} (score: ${newScores[weakest]}), ${secondWeakest} (score: ${newScores[secondWeakest]})`
          );
          console.log(
            `Step 5 will test: ${weakest}. Step 6 will test: ${secondWeakest}`
          );
        }

        if (currentStep >= 5) {
          console.log("Dream Day final scores:", newScores);
          await AsyncStorage.setItem("journy_dreamday_scores", JSON.stringify(newScores));

          if (isFromProfile) {
            const zero: DimensionScoreInput = { plan_flow: 0, busy_relaxed: 0, comfort_adventure: 0, immerse_observe: 0 };
            let swipeScores = zero;
            try {
              const raw = await AsyncStorage.getItem("journy_swipe_scores");
              if (raw) swipeScores = JSON.parse(raw);
            } catch {}
            const newResult = calculateTravelerType(swipeScores, newScores);
            let oldCode: string | null = null;
            try {
              const raw = await AsyncStorage.getItem("journy_type_result");
              if (raw) oldCode = JSON.parse(raw).code;
            } catch {}
            await AsyncStorage.setItem("journy_type_result", JSON.stringify(newResult));
            await AsyncStorage.setItem("journy_type_color", newResult.groupColor);
            if (newResult.code !== oldCode) {
              router.push({ pathname: "/(onboarding)/type-reveal", params: { mode: "updated" } });
            } else {
              router.push("/(tabs)/profile");
            }
          } else {
            router.push("/(onboarding)/interests-intro");
          }
        } else {
          goToStep(currentStep + 1);
        }
      }, 300);
    },
    [currentStep, scores, allSteps, goToStep, router, scaleAnim]
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top + 31,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
      }}
    >
      <StatusBar style="dark" />

      {/* Progress bar — hidden during profile redo */}
      {!isFromProfile && (
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
              width: `${progressPercent}%`,
              height: 4,
              backgroundColor: "#1A7D7A",
              borderRadius: 2,
            }}
          />
        </View>
      )}

      {/* Step indicator */}
      <Text
        style={{
          fontFamily: "Lora_400Regular",
          fontSize: 12,
          lineHeight: 17,
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: 12,
        }}
      >
        Step {currentStep + 1} of 6
      </Text>

      {/* Animated content */}
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        {/* Question */}
        <Text
          style={{
            fontFamily: "PlayfairDisplay_700Bold",
            fontSize: 24,
            lineHeight: 29,
            color: "#111827",
            textAlign: "center",
            width: 310,
            alignSelf: "center",
            marginTop: 21,
          }}
        >
          {step.question}
        </Text>

        {/* Vertical card list */}
        <View style={{ marginTop: 24, gap: 10 }}>
          {step.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            return (
              <Pressable key={index} onPress={() => handleCardPress(index)}>
                <Animated.View
                  style={[
                    {
                      borderRadius: 12,
                      padding: 16,
                      backgroundColor: isSelected ? "#E6F5F4" : "#FFFFFF",
                      borderWidth: isSelected ? 2 : 1.5,
                      borderColor: isSelected ? "#1A7D7A" : "#E5E7EB",
                    },
                    isSelected && {
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: "Lora_400Regular",
                      fontSize: 14,
                      lineHeight: 21,
                      color: "#111827",
                    }}
                  >
                    {choice.text}
                  </Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

    </View>
  );
}
