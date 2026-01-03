import http from './http.api'
import { saveToSecureStore, getFromSecureStore, deleteFromSecureStore } from '../utils/secureStore.util';

export const login = async (email: string, password: string) => {
    const response = await http.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    
    // Validate that tokens are strings before storing
    if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Invalid access token received from server');
    }
    if (!refreshToken || typeof refreshToken !== 'string') {
        throw new Error('Invalid refresh token received from server');
    }
    
    await saveToSecureStore('accessToken', accessToken);
    await saveToSecureStore('refreshToken', refreshToken);
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
        console.log('Logout API failed, clearing local tokens anyway');
    } finally {
        // Always delete tokens from secure store
        await deleteFromSecureStore('accessToken');
        await deleteFromSecureStore('refreshToken');
        await deleteFromSecureStore('userEmail');
    }
}

export const getUserByEmail = async (email: string) => {
    const response = await http.get(`/user/findbyemail/${email}`);
    return response.data.user;
}

export const refreshAccessToken = async () => {
    const refreshToken = await getFromSecureStore('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    
    const response = await http.post('/auth/refresh-token', { refreshToken });
    const { accessToken } = response.data;
    
    if (!accessToken || typeof accessToken !== 'string') {
        throw new Error('Invalid access token received from server');
    }
    
    await saveToSecureStore('accessToken', accessToken);
    return accessToken;
}

export const editUser = async (userId: string, updates: { username: string }) => {
    const response = await http.patch(`/user/edituser/${userId}`, updates);
    return response.data.user;
}