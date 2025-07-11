import { OTPInput, type OTPInputRef, type SlotProps } from "input-otp-native";
import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Text, View } from "tamagui";
import { useChainApi, useChainData } from "./ChainContext";

export default function WordDisplay({ index }: { index: number }) {
  const { status, correctChain, currentChain, solvedByIndex } = useChainData();
  const { selectHintIndex } = useChainApi();

  const displayWord = status === "loser" ? correctChain[index] : currentChain[index];
  const isSolved = solvedByIndex[index];
  const isSelectable = status === "selecting" && !isSolved;
  const ref = useRef<OTPInputRef>(null);

  const handlePress = () => {
    if (isSelectable) {
      selectHintIndex(index);
    }
  };

  return (
    <View onTouchEnd={handlePress}>
      <OTPInput
        ref={ref}
        value={displayWord}
        editable={false}
        maxLength={10}
        render={({ slots }) => (
          <View flexDirection="row" alignItems="center">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} index={idx} />
            ))}
          </View>
        )}
      />
    </View>
  );
}

function Slot({ char, isActive, hasFakeCaret, index }: SlotProps & { index: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (char !== null) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    }
  }, [char]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      width={36}
      height={48}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderColor={isActive ? "black" : "#d1d5db"}
      backgroundColor={isActive ? "white" : "#f9fafb"}
      borderRadius={4}
      //   mx={2}
    >
      <Animated.View style={animatedStyle}>
        {char !== null && (
          <Text fontSize={24} fontWeight="600" color="#111827">
            {char.toUpperCase()}
          </Text>
        )}
      </Animated.View>
      {hasFakeCaret && <FakeCaret />}
    </View>
  );
}

function FakeCaret() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View position="absolute" width="100%" height="100%" alignItems="center" justifyContent="center">
      <Animated.View
        style={[
          {
            width: 2,
            height: 28,
            backgroundColor: "black",
            borderRadius: 1,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
