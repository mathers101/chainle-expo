import { ChainProvider, SaveData } from "@/components/ChainContext";
import Game from "@/components/Game";
import { getFromLocalStorage } from "@/lib/saveToLocalStorage";
import { getTodaysDate } from "@/lib/time";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Spinner, YStack } from "tamagui";

const SUPABASE_URL = "https://pqcesmmadoqglwvnuval.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxY2VzbW1hZG9xZ2x3dm51dmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODU0ODAsImV4cCI6MjA2NzM2MTQ4MH0.i0DkVEeZSnMnko-V5dGRycs5uO0GXz7igM795QGVBno";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const today = getTodaysDate();
  const [chain, setChain] = useState<string[] | null>(null);
  const [savedData, setSavedData] = useState<SaveData | null>(null);

  const getTodaysChain = async () => {
    const { data } = await supabase.from("chains").select().eq("date", today).maybeSingle();
    setChain(data.chain);
  };

  useEffect(() => {
    (async () => {
      const data = await getFromLocalStorage();
      setSavedData(data);
    })();
    getTodaysChain();
  }, []);

  if (!chain) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <ScrollView className="justify-center h-full">
      <ChainProvider correctChain={chain} savedData={savedData}>
        <Game />
      </ChainProvider>
    </ScrollView>
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
