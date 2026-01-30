import http from './http.api';
import { getFromSecureStore } from '../utils/secureStore.util';

export const getFiles = async (file: any) => {
    const userId = await getFromSecureStore('userId');
    const response = await http.get(`/files/files?ownerId=${userId}`);
    // API returns array directly or wrapped in data/files
    return Array.isArray(response.data) ? response.data : response.data.files || [];
}

export const uploadFile = async (fileData: {
    uri: string;
    name: string;
    type: string;
    folder?: string;
}) => {
    const userId = await getFromSecureStore('userId');
    
    const formData = new FormData();
    
    // Append the file
    formData.append('file', {
        uri: fileData.uri,
        name: fileData.name,
        type: fileData.type,
    } as any);
    
    // Append other fields
    formData.append('ownerId', userId || '');
    if (fileData.folder) {
        formData.append('folder', fileData.folder);
    }
    
    const response = await http.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
}

export const uploadMultipleFiles = async (files: Array<{
    uri: string;
    name: string;
    type: string;
}>, folder: string, onProgress?: (fileName: string, index: number, total: number) => void) => {
    const userId = await getFromSecureStore('userId');
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Call progress callback before uploading each file
        if (onProgress) {
            onProgress(file.name, i + 1, files.length);
        }
        
        const formData = new FormData();
        
        formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);
        
        formData.append('ownerId', userId || '');
        formData.append('folder', folder);
        
        try {
            const response = await http.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            results.push({ success: true, fileName: file.name, data: response.data });
        } catch (error: any) {
            results.push({ success: false, fileName: file.name, error: error.message });
        }
    }
    
    return results;
}