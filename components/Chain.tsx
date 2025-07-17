import { useChainApi, useChainData } from "@/components/ChainContext";
import { useEffect, useState } from "react";
import { XStack, YStack } from "tamagui";
import ConfirmButton from "./ConfirmButton";
import Share from "./Share";
import WordDisplay from "./WordDisplay";
import WordInput from "./WordInput";

export const MAX_WIDTH = 380;

export default function Chain() {
  const { solvedByIndex, currentChain, status, currentGuessValid, correctChain, userGuesses } = useChainData();
  const { confirmGuess, setStatus, resetGuess } = useChainApi();

  const initialRevealedIndexes =
    status === "guessing"
      ? currentChain.map((_, idx) => idx).filter((idx) => solvedByIndex[idx] === true)
      : currentChain.map((_, idx) => idx);

  const [revealedIndexes, setRevealedIndexes] = useState<number[]>(initialRevealedIndexes);

  const isWinner = status === "winner";
  const isLoser = status === "loser";
  const gameOver = isWinner || isLoser;

  const showDisplayInput = (index: number) => {
    if (status !== "guessing") return true;
    return solvedByIndex[index] ?? true;
  };

  const handleConfirmGuess = async () => {
    if (status !== "guessing" || !currentGuessValid) return;
    const indexesToReveal = currentChain.map((_, idx) => idx).filter((idx) => !solvedByIndex[idx]);

    confirmGuess();
    for (let idx of indexesToReveal) {
      setRevealedIndexes((prev) => [...prev, idx]);
      await new Promise((res) => setTimeout(res, 500));
    }
    setTimeout(() => {
      setStatus("selecting");
      resetGuess();
    }, 500);
  };

  useEffect(() => {
    if (status === "guessing") {
      setRevealedIndexes(currentChain.map((_, idx) => idx).filter((idx) => solvedByIndex[idx]));
    } else if (status === "revealing") {
      return;
    } else {
      setRevealedIndexes(currentChain.map((_, idx) => idx));
    }
  }, [status]);

  // const screenWidth = Dimensions.get("window").width;

  return (
    <YStack gap="$5" alignItems="center">
      <YStack gap="$2" alignItems="center">
        {/* <YStack gap="$2"> */}
        {currentChain.map((_, index) => (
          <XStack key={index} alignItems="center">
            {/* {showDisplayInput(index) ? ( */}
            {showDisplayInput(index) && revealedIndexes.includes(index) ? (
              <WordDisplay index={index} />
            ) : (
              <WordInput index={index} />
            )}
          </XStack>
        ))}
      </YStack>
      {gameOver ? (
        <Share correctChain={correctChain} userGuesses={userGuesses} />
      ) : (
        <ConfirmButton handleConfirmGuess={handleConfirmGuess} />
      )}
    </YStack>
  );
}
