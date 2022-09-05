import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeData(key: string, value: string): Promise<void>{
    await AsyncStorage.setItem(`@${key}`, value)
}
export async function retrieveData(key: string): Promise<string> {
    const value = await AsyncStorage.getItem(`@${key}`)
    return value || ''
}
