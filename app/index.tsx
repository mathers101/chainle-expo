import { ChainProvider } from "@/components/ChainContext";
import React, { useEffect, useState } from "react";
import { Spinner, YStack } from "tamagui";
import "./glob.css";

import Game from "@/components/Game";
import { getFromLocalStorage } from "@/lib/saveToLocalStorage";

export default function Home() {
  const [savedData, setSavedData] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getFromLocalStorage();
      setSavedData(data);
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const correctChain = ["back", "light", "house", "party", "favor", "request", "form"]; // replace with dynamic load

  return (
    <ChainProvider correctChain={correctChain} savedData={savedData}>
      <Game />
    </ChainProvider>
  );
}

// function GameScreen() {
//   return (
//     <YStack flex={1} padding={16} alignItems="center">
//       <Text fontSize={24} fontWeight="600">
//         Chainle
//       </Text>
//       <Text fontSize={16} color="#555">
//         Complete the chain using two-word phrases
//       </Text>
//       <Chain />
//     </YStack>
//   );
// }
