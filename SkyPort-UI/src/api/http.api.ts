import axios from 'axios';
import { getFromSecureStore, saveToSecureStore } from '../utils/secureStore.util';

const http = axios.create({
    baseURL: 'http://192.168.0.106:3005/api', // Adjust the baseURL as needed
    withCredentials: true, // Include cookies for cross-origin requests
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

http.interceptors.request.use(async (config) => {
    const token = await getFromSecureStore('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 or 403 and we haven't tried to refresh yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return http(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getFromSecureStore('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh token endpoint
                const response = await http.post('/auth/refresh-token', { 
                    refreshToken 
                });
                
                const { accessToken } = response.data;
                await saveToSecureStore('accessToken', accessToken);

                // Update authorization header
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                
                processQueue(null, accessToken);
                isRefreshing = false;

                // Retry the original request
                return http(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                
                // If refresh fails, user needs to login again
                console.error('Token refresh failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;