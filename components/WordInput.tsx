import { useRef } from "react";
import Animated from "react-native-reanimated";
import { useChainApi, useChainData } from "./ChainContext";
import GameInput from "./ui/GameInput";

export default function WordInput({ index }: { index: number }) {
  const { currentChain, currentHintIndex, currentGuess } = useChainData();
  const { setGuess } = useChainApi();

  const currentlyRevealed = currentChain[index] ?? "";
  const currentlyRevealedRef = useRef<string>(currentlyRevealed);

  const isCurrentHintIndex = index === currentHintIndex;

  const onChange = (value: string) => {
    const newsuffix = value.replace(/[^A-Za-z]/g, "").slice(currentlyRevealedRef.current.length);
    const newWord = currentlyRevealedRef.current + newsuffix;
    if (newWord.length >= currentlyRevealed.length) {
      setGuess(index, newWord);
    }
  };

  return (
    <Animated.View>
      <GameInput
        value={currentGuess[index]}
        onChange={onChange}
        autoFocus={isCurrentHintIndex}
        animatedInputIndex={isCurrentHintIndex ? currentlyRevealed.length - 1 : undefined}
      />
    </Animated.View>
  );
}
