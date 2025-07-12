import "@/global.css";
import { defaultConfig } from "@tamagui/config/v4";
import { Stack } from "expo-router";
import { createTamagui, TamaguiProvider } from "tamagui";

const config = createTamagui(defaultConfig);

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
