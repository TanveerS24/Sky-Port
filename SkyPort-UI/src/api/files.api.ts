import http from './http.api';
import { getFromSecureStore } from '../utils/secureStore.util';

export const getFiles = async (file: any) => {
    const userId = await getFromSecureStore('userId');
    const response = await http.get(`/files/files?ownerId=${userId}`);
    // API returns array directly or wrapped in data/files
    return Array.isArray(response.data) ? response.data : response.data.files || [];
}