import * as SecureStore from 'expo-secure-store';

export const saveToSecureStore = async (key: string, value: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('Error saving to secure store:', error);
    }
};

export const getFromSecureStore = async (key: string): Promise<string | null> => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return value;
    } catch (error) {
        console.error('Error retrieving from secure store:', error);
        return null;
    }
};

export const deleteFromSecureStore = async (key: string): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Error deleting from secure store:', error);
    }
};