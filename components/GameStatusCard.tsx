import { ReactNode } from "react";
import { Card, Text, YStack } from "tamagui";
import { useChainData } from "./ChainContext";

interface GameStatusCardProps {
  nextGameComponent: ReactNode;
}

export default function GameStatusCard({ nextGameComponent }: GameStatusCardProps) {
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
      <StatusMessage
        isWinner={isWinner}
        isLoser={isLoser}
        isSelecting={isSelecting}
        nextGameComponent={nextGameComponent}
      />
    </Card>
  );
}

interface StatusMessageProps {
  isWinner: boolean;
  isLoser: boolean;
  isSelecting: boolean;
  nextGameComponent: ReactNode;
}

function StatusMessage({ isWinner, isLoser, isSelecting, nextGameComponent }: StatusMessageProps) {
  if (isWinner) return <WinnerMessage nextGameComponent={nextGameComponent} />;
  if (isLoser) return <LoserMessage nextGameComponent={nextGameComponent} />;
  if (isSelecting) return <SelectingMessage />;
  return <DefaultMessage />;
}

function WinnerMessage({ nextGameComponent }: { nextGameComponent: ReactNode }) {
  return (
    <YStack alignItems="center" space={4}>
      <Text color="#065f46" fontWeight="700" fontSize={20}>
        🎉 Congratulations! 🎉
      </Text>
      {nextGameComponent}
    </YStack>
  );
}

function LoserMessage({ nextGameComponent }: { nextGameComponent: ReactNode }) {
  return (
    <YStack alignItems="center" space={4}>
      <Text color="#7f1d1d" fontWeight="700" fontSize={20}>
        Game over
      </Text>
      {nextGameComponent}
    </YStack>
  );
}

function SelectingMessage() {
  return (
    <Text color="#78350f" fontWeight="600" fontSize={18}>
      Select a word to reveal a letter!
    </Text>
  );
}

function DefaultMessage() {
  return (
    <Text color="#1e3a8a" fontWeight="600" fontSize={18}>
      Attempt to guess the entire chain of words!
    </Text>
  );
}
