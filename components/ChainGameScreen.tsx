import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useChainApi, useChainData } from "./ChainContext";

export default function ChainGameScreen() {
  const { currentChain, solvedByIndex, guessesRemaining, status } = useChainData();
  const { setGuess, confirmGuess } = useChainApi();

  const [inputs, setInputs] = useState<string[]>(currentChain.map(() => ""));

  const handleInputChange = (index: number, text: string) => {
    setInputs((prev) => {
      const newInputs = [...prev];
      newInputs[index] = text;
      return newInputs;
    });
    setGuess(index, text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.status}>Status: {status}</Text>
      <Text style={styles.remaining}>Guesses Remaining: {guessesRemaining}</Text>

      {currentChain.map((word, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.word}>{word}</Text>
          {solvedByIndex[index] ? (
            <Text style={styles.solved}>✓</Text>
          ) : (
            <TextInput
              style={styles.input}
              value={inputs[index]}
              onChangeText={(text) => handleInputChange(index, text)}
            />
          )}
        </View>
      ))}

      <Button title="Confirm Guess" onPress={confirmGuess} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  word: { width: 100, fontSize: 18 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, flex: 1 },
  solved: { fontSize: 18, color: "green" },
  status: { fontSize: 18, marginBottom: 10 },
  remaining: { fontSize: 16, marginBottom: 20 },
});
