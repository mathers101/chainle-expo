import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToLocalStorage(data: any) {
  try {
    await AsyncStorage.setItem("chainle-save", JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export async function getFromLocalStorage() {
  try {
    const value = await AsyncStorage.getItem("chainle-save");
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
