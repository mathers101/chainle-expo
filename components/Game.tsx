import { XStack, YStack } from "tamagui";
import Chain from "./Chain";
import { useChainData } from "./ChainContext";
import GameStatus from "./GameStatus";
import GuessesRemaining from "./GuessesRemaining";
import Share from "./Share";

export default function Game() {
  const { userGuesses, correctChain, guessesRemaining, status } = useChainData();
  const gameOver = status === "winner" || status === "loser";

  return (
    <YStack gap={16} alignItems="center" marginTop={30}>
      <GameStatus />

      {/* <h2>{`Current chain: ${currentChain.join(" -> ")}`}</h2>
      <h2>{`Status: ${status}`}</h2> */}

      <XStack alignItems="center" justifyContent="center" marginBottom={8}>
        {gameOver ? (
          <Share correctChain={correctChain} userGuesses={userGuesses} />
        ) : (
          <GuessesRemaining guessesRemaining={guessesRemaining} />
        )}
      </XStack>

      <Chain />
    </YStack>
  );
}
