import { Text, XStack, YStack } from "tamagui";
import { useTimeUntilTomorrow } from "../hooks/useTimeUntilTomorrow";
import Chain from "./Chain";
import { useChainData } from "./ChainContext";
import GameStatusCard from "./GameStatusCard";
import GuessesRemaining from "./GuessesRemaining";
import Share from "./Share";

export default function Game() {
  const { userGuesses, correctChain, guessesRemaining, status } = useChainData();
  const { hours, minutes, seconds } = useTimeUntilTomorrow();

  const isWinner = status === "winner";
  const isLoser = status === "loser";
  const gameOver = isWinner || isLoser;

  const nextGameComponent = (
    <Text>{`Next chain available in ${hours} hours, ${minutes} minutes, ${seconds} seconds`}</Text>
  );

  return (
    <YStack space={16} alignItems="center">
      <GameStatusCard nextGameComponent={nextGameComponent} />

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
