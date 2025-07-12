import { useChainApi, useChainData } from "@/components/ChainContext";
import { useEffect, useState } from "react";
import { Button, XStack, YStack } from "tamagui";
import WordDisplay from "./WordDisplay";
import WordInput from "./WordInput";

export default function Chain() {
  const { solvedByIndex, currentChain, status, currentGuessValid } = useChainData();
  const { confirmGuess, resetGame, setStatus } = useChainApi();

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
    setTimeout(() => setStatus("selecting"), 500);
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

  return (
    <YStack gap="$2" alignItems="center">
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
      {gameOver ? (
        <Button
          style={{ width: "100%", height: 60, backgroundColor: "#FCA5A5", color: "#7F1D1D" }} // bg-red-300 text-red-900
          size="$5"
          fontWeight="700"
          onPress={resetGame}
        >
          Reset Game
        </Button>
      ) : (
        <Button
          style={{ width: "100%", height: 60, backgroundColor: "#93C5FD", color: "#1e3a8a" }} // bg-blue-300 text-blue-900
          size="$5"
          fontWeight="700"
          disabled={status !== "guessing" || !currentGuessValid}
          onPress={handleConfirmGuess}
        >
          Confirm Guess
        </Button>
      )}
    </YStack>
  );
}
