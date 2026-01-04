import http from './http.api';
import { saveToSecureStore, getFromSecureStore, deleteFromSecureStore } from '../utils/secureStore.util';

export const getUserByEmail = async (email: string) => {
    const response = await http.get(`/user/findbyemail/${email}`);
    await saveToSecureStore('userEmail', email);
    await saveToSecureStore('userId', response.data.user._id);
    return response.data.user;
}

export const editUser = async (userId: string, updates: { username: string }) => {
    const response = await http.patch(`/user/edituser/${userId}`, updates);
    return response.data.user;
}