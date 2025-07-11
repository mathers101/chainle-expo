import * as Clipboard from "expo-clipboard";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { Button, Text } from "tamagui";
import { getTodaysDate } from "../lib/time";
import { transpose } from "../lib/transpose";
import { MAX_GUESSES, type Guess } from "./ChainContext";

interface ShareProps {
  correctChain: string[];
  userGuesses: Guess[];
}

export default function Share({ correctChain, userGuesses }: ShareProps) {
  const [year, month, day] = getTodaysDate()
    .split("-")
    .map((val) => Number(val.slice(-2)));
  const date = `${month}/${day}/${year}`;

  const resultString = transpose(userGuesses)
    .map((guess, idx) =>
      guess
        .map((word) => {
          if (idx === 0 || idx === correctChain.length - 1) {
            return "🟨";
          } else if (word === correctChain[idx]) {
            return "🟩";
          } else {
            return "⬜";
          }
        })
        .join("")
    )
    .join("\n");

  const shareString = `Chainle ${date}\n${userGuesses.length}/${MAX_GUESSES} attempts\n\n${resultString}`;

  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(shareString, {
            dialogTitle: "Share your Chainle result",
            mimeType: "text/plain",
            UTI: "public.plain-text",
          });
          return;
        }
      }

      // Fallback: copy to clipboard
      await Clipboard.setStringAsync(shareString);
      Alert.alert("Copied!", "Your result has been copied to the clipboard.");
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Unable to share your result.");
    }
  };

  return (
    <Button theme="blue" onPress={handleShare} padding="$3" borderRadius="$4">
      <Text color="white" fontWeight="600">
        Share your result
      </Text>
    </Button>
  );
}
