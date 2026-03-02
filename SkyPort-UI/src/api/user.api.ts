import http from './http.api';
import { saveToSecureStore } from '../utils/secureStore.util';

export const getUserByEmail = async (email: string) => {
    console.log('getUserByEmail API called with email:', email);
    const response = await http.get(`/user/findbyemail/${email}`);
    console.log('API response:', response.data);
    await saveToSecureStore('userEmail', email);
    await saveToSecureStore('userId', response.data.user._id);
    return response.data.user;
}

export const getUserByEmailHash = async (emailHash: string) => {
    const response = await http.get(`/user/findbyemailhash/${emailHash}`);
    return response.data.user;
}

export const editUser = async (userId: string, updates: { username: string }) => {
    const response = await http.patch(`/user/edituser/${userId}`, updates);
    return response.data.user;
}

export const sendFriendRequest = async (senderEmail: string, receiverEmail: string) => {
    const response = await http.post('/user/sendfriendrequest', { senderEmail, receiverEmail });
    return response.data;
}

export const approveFriendRequest = async (userEmail: string, requesterEmailHash: string) => {
    const response = await http.post('/user/approvefriendrequest', { userEmail, requesterEmailHash });
    return response.data;
}

export const rejectFriendRequest = async (userEmail: string, requesterEmailHash: string) => {
    const response = await http.post('/user/rejectfriendrequest', { userEmail, requesterEmailHash });
    return response.data;
}

export const getNotifications = async (email: string) => {
    const encodedEmail = encodeURIComponent(email);
    const response = await http.get(`/user/notifications/${encodedEmail}`);
    return response.data;
}

export const markNotificationsRead = async (email: string) => {
    const response = await http.post('/user/marknotificationsread', { email });
    return response.data;
}