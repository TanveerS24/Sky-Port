import http from './http.api'
import { saveToSecureStore, deleteFromSecureStore } from '../utils/secureStore.util';

export const login = async (email: string, password: string) => {
    const response = await http.post('/auth/login', { email, password });
    const { accessToken } = response.data;
    
    // Validate that accessToken is a string before storing
    if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Invalid access token received from server');
    }
    
    await saveToSecureStore('accessToken', accessToken);
    return response.data;
}

export const register = async (username: string, email: string, password: string) => {
    const response = await http.post('/auth/register', { username, email, password });
    return response.data;
}

export const logout = async () => {
    try {
        await http.post('/auth/logout');
    } catch (error) {
        console.log('Logout API failed, clearing local token anyway');
    } finally {
        // Always delete token from secure store
        await deleteFromSecureStore('accessToken');
    }
}