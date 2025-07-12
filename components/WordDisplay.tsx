import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FlipInEasyX,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useChainApi, useChainData } from "./ChainContext";
import GameInput from "./ui/GameInput";
import { Theme } from "./ui/otp-input.tsx";

export default function WordDisplay({ index }: { index: number }) {
  const { status, correctChain, currentChain, solvedByIndex, guessesRemaining, inputRefs } = useChainData();
  const { selectHintIndex } = useChainApi();

  const isInitialWord = index === 0 || index === correctChain.length - 1;

  // this isLoser variable will be true before status === "loser" is set, this is so that the correct answer reveals on the final reveal before the losing message is shown
  const isLoser = guessesRemaining === 0;

  const displayWord = isLoser ? correctChain[index] : currentChain[index];
  const isSolved = solvedByIndex[index];
  const isSelectable = status === "selecting" && !isSolved;

  const backgroundColor = isInitialWord ? "#facc15" : isSolved ? "#22c55e" : isLoser ? "#d1d5db" : "";

  const handlePress = () => {
    if (isSelectable) {
      selectHintIndex(index);
    }
  };

  const styles: Theme = StyleSheet.create({
    pinCodeContainerStyle: {
      backgroundColor,
    },
    filledPinCodeContainerStyle: {
      backgroundColor,
    },
  });

  const translateY = useSharedValue(0);

  useEffect(() => {
    if (status === "winner") {
      translateY.value = withRepeat(
        withSequence(withTiming(-10, { duration: 150 }), withTiming(0, { duration: 150 })),
        6, // repeat count
        true // reverse
      );
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View entering={!isInitialWord ? FlipInEasyX.duration(1000) : undefined} style={animatedStyle}>
      <GameInput
        value={displayWord}
        disabled={true}
        styles={styles}
        onPress={isSelectable ? handlePress : undefined}
        cursorStyle={isSelectable ? "pointer" : "not-allowed"}
      />
    </Animated.View>
  );
}
