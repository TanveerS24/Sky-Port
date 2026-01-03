import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const http = axios.create({
    baseURL: 'http://192.168.0.108:3005/api', // Adjust the baseURL as needed
    withCredentials: true, // Include cookies for cross-origin requests
});

http.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default http;