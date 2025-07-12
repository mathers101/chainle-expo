import { Card, Text } from "tamagui";

export default function GuessesRemaining({ guessesRemaining }: { guessesRemaining: number }) {
  const { bgColor, textColor } = getGuessesColor(guessesRemaining);

  return (
    <Card
      backgroundColor={bgColor}
      borderRadius={8}
      paddingVertical={8}
      paddingHorizontal={12}
      alignItems="center"
      justifyContent="center"
      minHeight={50}
      marginBottom={8}
    >
      <Text fontSize={18} fontWeight="600" color={textColor} textAlign="center">
        Guesses remaining:{" "}
        <Text fontWeight="700" color={textColor}>
          {guessesRemaining}
        </Text>
      </Text>
    </Card>
  );
}

function getGuessesColor(guessesRemaining: number) {
  if (guessesRemaining >= 4) {
    return { bgColor: "#d1fae5", textColor: "#065f46" }; // green-100 bg, green-800 text
  } else if (guessesRemaining >= 2) {
    return { bgColor: "#fef9c3", textColor: "#78350f" }; // yellow-100 bg, yellow-800 text
  } else {
    return { bgColor: "#fecaca", textColor: "#7f1d1d" }; // red-100 bg, red-800 text
  }
}
