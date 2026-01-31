import http from './http.api';
import { getFromSecureStore } from '../utils/secureStore.util';

export const getFiles = async (file: any) => {
    const userId = await getFromSecureStore('userId');
    const response = await http.get(`/files/files?ownerId=${userId}`);
    // API returns array directly or wrapped in data/files
    return Array.isArray(response.data) ? response.data : response.data.files || [];
}

export const deleteFile = async (fileId: string) => {
    const userId = await getFromSecureStore('userId');
    const response = await http.post('/files/delete', {
        fileId,
        ownerId: userId
    });
    return response.data;
}

export const uploadFile = async (fileData: {
    uri: string;
    name: string;
    type: string;
    size?: number;
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
    if (fileData.size) {
        formData.append('size', fileData.size.toString());
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
    size?: number;
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
        if (file.size) {
            formData.append('size', file.size.toString());
        }
        
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

export const uploadBulkFiles = async (files: Array<{
    uri: string;
    name: string;
    type: string;
    size?: number;
    folder?: string;
}>) => {
    const userId = await getFromSecureStore('userId');
    
    const formData = new FormData();
    
    // Append all files
    files.forEach((file) => {
        formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.type,
        } as any);
    });
    
    // Append other fields
    formData.append('ownerId', userId || '');
    
    // Append folder paths as JSON array
    const folderPaths = files.map(f => f.folder || 'skyport');
    formData.append('folderPaths', JSON.stringify(folderPaths));
    
    // Append sizes as JSON array if available
    if (files.some(f => f.size)) {
        const sizes = files.map(f => f.size || 0);
        formData.append('sizes', JSON.stringify(sizes));
    }
    
    const response = await http.post('/files/upload-bulk', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
}