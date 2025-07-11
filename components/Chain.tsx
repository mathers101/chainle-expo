import { useChainApi, useChainData } from "@/components/ChainContext";
import { useEffect, useState } from "react";
import { Button, XStack, YStack } from "tamagui";
import WordDisplay from "./WordDisplay";
import WordInput from "./WordInput";

export default function Chain() {
  const { solvedByIndex, currentChain, status, currentGuessValid } = useChainData();
  const { confirmGuess, resetGame, setStatus } = useChainApi();

  const [revealedIndexes, setRevealedIndexes] = useState<number[]>(
    status === "guessing"
      ? currentChain.map((_, idx) => idx).filter((idx) => solvedByIndex[idx])
      : currentChain.map((_, idx) => idx)
  );

  const isWinner = status === "winner";
  const isLoser = status === "loser";
  const gameOver = isWinner || isLoser;

  const showDisplayInput = (index: number) => {
    if (status !== "guessing") return true;
    return solvedByIndex[index] ?? true;
  };

  const handleConfirmGuess = async () => {
    if (status !== "guessing") return;
    const indexesToReveal = currentChain.map((_, idx) => idx).filter((idx) => !solvedByIndex[idx]);

    confirmGuess();
    for (let idx of indexesToReveal) {
      setRevealedIndexes((prev) => [...prev, idx]);
      await new Promise((res) => setTimeout(res, 300));
    }
    setTimeout(() => setStatus("selecting"), 500);
  };

  useEffect(() => {
    if (status === "guessing") {
      setRevealedIndexes(currentChain.map((_, idx) => idx).filter((idx) => solvedByIndex[idx]));
    } else {
      setRevealedIndexes(currentChain.map((_, idx) => idx));
    }
  }, [status]);

  return (
    <YStack space="$3" alignItems="center">
      {currentChain.map((_, index) => (
        <XStack key={index} alignItems="center" space="$2">
          {showDisplayInput(index) && revealedIndexes.includes(index) ? (
            <WordDisplay index={index} />
          ) : (
            <WordInput index={index} />
          )}
        </XStack>
      ))}
      {gameOver ? (
        <Button theme="red" onPress={resetGame}>
          Reset Game
        </Button>
      ) : (
        <Button theme="blue" disabled={status !== "guessing" || !currentGuessValid} onPress={handleConfirmGuess}>
          Confirm Guess
        </Button>
      )}
    </YStack>
  );
}
