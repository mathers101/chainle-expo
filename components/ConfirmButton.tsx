import { Button } from "tamagui";
import { useChainData } from "./ChainContext";

interface ConfirmButtonProps {
  handleConfirmGuess: () => void;
}

export default function ConfirmButton({ handleConfirmGuess }: ConfirmButtonProps) {
  const { status, currentGuessValid } = useChainData();
  return (
    <Button
      style={{ width: "100%", height: 54, backgroundColor: "#93C5FD", color: "#1e3a8a" }} // bg-blue-300 text-blue-900
      size="$5"
      fontWeight="700"
      disabled={status !== "guessing" || !currentGuessValid}
      onPress={handleConfirmGuess}
    >
      Confirm Guess
    </Button>
  );
}
