import { useRef } from "react";
import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";
import { useChainApi, useChainData } from "./ChainContext";
import GameInput from "./ui/GameInput";

export default function WordInput({ index }: { index: number }) {
  const { currentChain, currentHintIndex, currentGuess, inputRefs } = useChainData();
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

  const value = currentGuess[index] ?? "";

  const _nextInputRefIndex = inputRefs.current.slice(index + 1).findIndex((ref) => ref !== null);
  const nextInputRefIndex = _nextInputRefIndex !== -1 ? _nextInputRefIndex + index + 1 : undefined;
  const nextInputRef = (nextInputRefIndex ? inputRefs.current[nextInputRefIndex] : undefined) ?? undefined;

  const onEnterKeyPress = () => nextInputRef?.focus();

  const _previousInputRefIndex = inputRefs.current
    .slice(0, index)
    .reverse()
    .findIndex((ref) => ref !== null);
  const previousInputRefIndex = _previousInputRefIndex !== -1 ? index - 1 - _previousInputRefIndex : undefined;
  const previousInputRef =
    (previousInputRefIndex !== undefined ? inputRefs.current[previousInputRefIndex] : undefined) ?? undefined;

  const onBackspaceKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (value.length === currentlyRevealedRef.current.length) {
      e.preventDefault();
      previousInputRef?.focus();
    }
  };

  return (
    <GameInput
      value={value}
      ref={(el) => {
        inputRefs.current[index] = el;
      }}
      onEnterKeyPress={onEnterKeyPress}
      onBackspaceKeyPress={onBackspaceKeyPress}
      // nextInputRef={nextInputRefIndex ? (inputRefs.current?.[nextInputRefIndex] ?? undefined) : undefined}
      onChange={onChange}
      autoFocus={isCurrentHintIndex}
      animatedInputIndex={isCurrentHintIndex ? currentlyRevealed.length - 1 : undefined}
    />
  );
}
