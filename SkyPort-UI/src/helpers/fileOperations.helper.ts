import * as Linking from 'expo-linking';

export const downloadFile = async (url: string, fileName: string) => {
  try {
    console.log('Opening file:', url);
    // Use the platform's native download/open handler
    await Linking.openURL(url);
    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (mimeType: string) => {
  return mimeType.startsWith('image/');
};

export const isVideoFile = (mimeType: string) => {
  return mimeType.startsWith('video/');
};

export const isDocumentFile = (mimeType: string) => {
  return !isImageFile(mimeType) && !isVideoFile(mimeType);
};

export const getFileIcon = (fileName: string) => {
  const ext = getFileExtension(fileName);
  const iconMap: Record<string, string> = {
    'pdf': 'document-text',
    'doc': 'document',
    'docx': 'document',
    'xls': 'grid',
    'xlsx': 'grid',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'mp4': 'play-circle',
    'mov': 'play-circle',
    'avi': 'play-circle',
    'zip': 'archive',
    'rar': 'archive',
  };
  
  return iconMap[ext] || 'document-outline';
};
