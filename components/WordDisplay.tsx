import { StyleSheet } from "react-native";
import Animated, { FlipInEasyX } from "react-native-reanimated";
import { useChainApi, useChainData } from "./ChainContext";
import GameInput from "./ui/GameInput";
import { Theme } from "./ui/otp-input.tsx";

export default function WordDisplay({ index }: { index: number }) {
  const { status, correctChain, currentChain, solvedByIndex } = useChainData();
  const { selectHintIndex } = useChainApi();

  const isInitialWord = index === 0 || index === correctChain.length - 1;
  const displayWord = status === "loser" ? correctChain[index] : currentChain[index];
  const isSolved = solvedByIndex[index];
  const isSelectable = status === "selecting" && !isSolved;

  const backgroundColor = isInitialWord ? "#facc15" : isSolved ? "#22c55e" : "";

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

  return (
    <Animated.View entering={!isInitialWord ? FlipInEasyX.duration(1000) : undefined}>
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
