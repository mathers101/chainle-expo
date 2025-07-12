import { SaveData } from "@/components/ChainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getTodaysDate } from "./time";

export async function saveToLocalStorage(data: SaveData) {
  const date = getTodaysDate();
  try {
    await AsyncStorage.setItem(`chainle-${date}`, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export async function getFromLocalStorage(): Promise<SaveData | null> {
  const date = getTodaysDate();
  try {
    const value = await AsyncStorage.getItem(`chainle-${date}`);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
