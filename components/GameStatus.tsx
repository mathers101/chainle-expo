import { useTimeUntilTomorrow } from "@/hooks/useTimeUntilTomorrow";
import { Pressable } from "react-native";
import { Card, Text, YStack } from "tamagui";
import { useChainApi, useChainData } from "./ChainContext";

const NextGameComponent = () => {
  const { hours, minutes, seconds } = useTimeUntilTomorrow();
  return (
    <YStack alignItems="center" gap={2}>
      <Text fontWeight="600" fontSize={16}>
        Next chain available in
      </Text>
      <Text fontWeight="700" fontSize={18}>
        {hours} hours, {minutes} minutes, {seconds} seconds
      </Text>
    </YStack>
  );
};

export default function GameStatus() {
  const { status } = useChainData();

  const isWinner = status === "winner";
  const isLoser = status === "loser";
  const isSelecting = status === "selecting";

  let bgColor = "#bfdbfe"; // blue-100
  if (isWinner) bgColor = "#d1fae5"; // green-100
  if (isLoser) bgColor = "#fecaca"; // red-100
  if (isSelecting) bgColor = "#fef9c3"; // yellow-100

  return (
    <Card
      backgroundColor={bgColor}
      marginBottom={8}
      padding={12}
      alignItems="center"
      justifyContent="center"
      minHeight={60}
    >
      <StatusMessage isWinner={isWinner} isLoser={isLoser} isSelecting={isSelecting} />
    </Card>
  );
}

interface StatusMessageProps {
  isWinner: boolean;
  isLoser: boolean;
  isSelecting: boolean;
}

function StatusMessage({ isWinner, isLoser, isSelecting }: StatusMessageProps) {
  if (isWinner) return <WinnerMessage />;
  if (isLoser) return <LoserMessage />;
  if (isSelecting) return <SelectingMessage />;
  return <DefaultMessage />;
}

function WinnerMessage() {
  return (
    <YStack alignItems="center" gap={4}>
      <Text color="#065f46" fontWeight={700} fontSize={20}>
        🎉 Congratulations! 🎉
      </Text>
      <NextGameComponent />
      <ResetButton />
    </YStack>
  );
}

function LoserMessage() {
  return (
    <YStack alignItems="center" gap={4}>
      <Text color="#7f1d1d" fontWeight={700} fontSize={20}>
        Game over
      </Text>
      <NextGameComponent />
      <ResetButton />
    </YStack>
  );
}

function SelectingMessage() {
  return (
    <Text alignItems="center" color="#78350f" fontWeight={600} fontSize={18}>
      Select a word to reveal a letter!
    </Text>
  );
}

function DefaultMessage() {
  return (
    <Text alignItems="center" color="#1e3a8a" fontWeight={600} fontSize={18}>
      Attempt to guess the entire chain of words!
    </Text>
  );
}

function ResetButton() {
  const { resetGame } = useChainApi();
  return (
    <Pressable onPress={resetGame}>
      <Text fontWeight={600} fontSize={14}>
        Reset game
      </Text>
    </Pressable>
  );
}
