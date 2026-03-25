import * as SecureStore from 'expo-secure-store';

export const saveToSecureStore = async (key: string, value: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error('Unable to save to secure store:', error);
    }
};

export const getFromSecureStore = async (key: string): Promise<string | null> => {
    try {
        const value = await SecureStore.getItemAsync(key);
        return value;
    } catch (error) {
        console.error('Unable to retrieve from secure store:', error);
        return null;
    }
};

export const deleteFromSecureStore = async (key: string): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Unable to delete from secure store:', error);
    }
};