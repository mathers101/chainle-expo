import { useRef, useState } from "react";
import Animated from "react-native-reanimated";
import { useChainApi, useChainData } from "./ChainContext";
import GameInput from "./ui/GameInput";

export default function WordInput({ index }: { index: number }) {
  const { currentChain, currentHintIndex } = useChainData();
  const { setGuess } = useChainApi();

  const [suffix, setSuffix] = useState("");

  const currentlyRevealed = currentChain[index] ?? "";
  const currentlyRevealedRef = useRef<string>(currentlyRevealed);

  const isCurrentHintIndex = index === currentHintIndex;

  const onChange = (value: string) => {
    const newsuffix = value.replace(/[^A-Za-z]/g, "").slice(currentlyRevealed.length);
    const newWord = currentlyRevealedRef.current + newsuffix;
    if (newWord.length >= currentlyRevealed.length) {
      setSuffix(newsuffix);
      setGuess(index, newWord);
    }
  };

  const value = currentlyRevealedRef.current + suffix;

  return (
    <Animated.View>
      <GameInput
        value={value}
        onChange={onChange}
        styles={{}}
        autoFocus={isCurrentHintIndex}
        // ref={ref}
      />
    </Animated.View>
  );
}
