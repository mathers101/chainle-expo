import { YStack } from "tamagui";
import Chain, { MAX_WIDTH } from "./Chain";
import { useChainData } from "./ChainContext";
import GameStatus from "./GameStatus";
import GuessesRemaining from "./GuessesRemaining";

export default function Game() {
  const { guessesRemaining, status } = useChainData();
  const gameOver = status === "winner" || status === "loser";

  return (
    <YStack gap={16} marginHorizontal="auto" marginVertical={12} maxWidth={MAX_WIDTH}>
      <GameStatus />
      {!gameOver && <GuessesRemaining guessesRemaining={guessesRemaining} />}
      <Chain />
    </YStack>
  );
}
