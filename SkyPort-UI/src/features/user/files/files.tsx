import {View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, Alert} from 'react-native';
import { useTheme } from '../../../context/themeProvider.context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import getItemsInFolder from '../../../helpers/itemsInFolder.helper';
import { getFiles, uploadFile, uploadMultipleFiles } from '../../../api/files.api';
import { FileHeader } from '../../../components/FileHeader';
import { FileRow } from '../../../components/FileRow';
import { FilePreviewModal } from '../../../components/FilePreviewModal';

interface CloudFile {
  cloudinary: {
    publicId: string;
    url: string;
  };
  fileId: string;
  fileName: string;
  mimeType: string;
  folder: string;
  sharedWith: string[];
  createdAt: string;
  _id: string;
}

interface TransformedFile {
  oid: string;
  name: string;
  uploadedBy: string;
  fileLocation: { folder: string };
  size: string;
  uploadedAt: string;
  cloudinaryUrl: string;
  mimeType: string;
  type: 'file';
}

const Files = () => {
    const { colors } = useTheme();
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [filesData, setFilesData] = useState<TransformedFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<TransformedFile | null>(null);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [addMenuVisible, setAddMenuVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{
      current: number;
      total: number;
      fileName: string;
      completed: boolean;
    } | null>(null);
    const router = useRouter();

    useEffect(() => {
      fetchFiles();
    }, []);

    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const cloudFiles = await getFiles({});
        
        console.log('Cloud files response:', cloudFiles);
        
        if (!cloudFiles || !Array.isArray(cloudFiles)) {
          console.warn('Invalid response format, expected array:', cloudFiles);
          setFilesData([]);
          return;
        }

        // Transform cloud files to match helper format
        const transformed = cloudFiles.map((file: CloudFile) => {
          // Remove 'skyport' prefix and handle path correctly
          let folderPath = file.folder;
          if (folderPath === 'skyport') {
            folderPath = 'root';
          } else if (folderPath.startsWith('skyport/')) {
            folderPath = folderPath.substring(8); // Remove 'skyport/' prefix
          }

          return {
            oid: file._id,
            name: file.fileName,
            uploadedBy: 'You',
            fileLocation: { 
              folder: folderPath
            },
            size: '-',
            uploadedAt: new Date(file.createdAt).toLocaleDateString(),
            cloudinaryUrl: file.cloudinary.url,
            mimeType: file.mimeType,
            type: 'file' as const,
          };
        });
        
        console.log('Transformed files:', transformed);
        setFilesData(transformed);
      } catch (err: any) {
        console.error('Error fetching files:', err);
        console.error('Error response:', err.response?.data);
        
        // 404 means no files yet, not an actual error
        if (err.response?.status === 404) {
          setFilesData([]);
          setError(null);
        } else {
          setError(err.response?.data?.message || 'Failed to load files');
        }
      } finally {
        setLoading(false);
      }
    };

  const { folders, files: visibleFiles } = getItemsInFolder(filesData, currentFolder);
  const allItems = [...folders, ...visibleFiles];
  
  const handleBackPress = () => {
    if (currentFolder) {
      const pathParts = currentFolder.split('/');
      if (pathParts.length > 1) {
        setCurrentFolder(pathParts.slice(0, -1).join('/'));
      } else {
        setCurrentFolder(null);
      }
    } else {
      router.back();
    }
  };

  const handleItemPress = (item: any) => {
    console.log('Item pressed:', item);
    if (item.type === 'folder') {
      const newPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
      setCurrentFolder(newPath);
    } else {
      console.log('Opening file preview for:', item.name);
      console.log('Visible files count:', visibleFiles.length);
      setSelectedFile(item);
      setPreviewModalVisible(true);
    }
  };

  const handleAddFile = async () => {
    setAddMenuVisible(false);
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

      const files = result.assets;
      
      setUploading(true);
      setUploadProgress({ current: 0, total: files.length, fileName: '', completed: false });
      
      // Construct folder path for upload
      let folderPath = 'skyport';
      if (currentFolder) {
        folderPath = `skyport/${currentFolder}`;
      }
      
      // Upload files one by one with progress
      const results = await uploadMultipleFiles(
        files.map(f => ({
          uri: f.uri,
          name: f.name,
          type: f.mimeType || 'application/octet-stream',
        })),
        folderPath,
        (fileName, current, total) => {
          setUploadProgress({ current, total, fileName, completed: false });
        }
      );
      
      // Mark as completed
      setUploadProgress(prev => prev ? { ...prev, completed: true } : null);
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (failCount > 0) {
        Alert.alert('Upload Completed', `${successCount} file(s) uploaded successfully, ${failCount} failed`);
      } else {
        Alert.alert('Success', `${successCount} file(s) uploaded successfully`);
      }
      
      // Refresh the file list
      await fetchFiles();
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      Alert.alert('Upload Error', error.response?.data?.message || 'Failed to upload file');
      setUploadProgress(null);
    } finally {
      setUploading(false);
    }
  };

  const handleAddFolder = async () => {
    // Same as handleAddFile now since we support multiple in both
    handleAddFile();
  };

  const handleDismissProgress = () => {
    setUploadProgress(null);
  };

  const emptyFiles = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading files...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.error, marginBottom: 20 }}>{error}</Text>
          <TouchableOpacity 
            style={[styles.centerAddButton, { backgroundColor: colors.btnPrimaryBg }]}
            onPress={() => setAddMenuVisible(true)}
          >
            <Text style={[styles.addButtonText, { color: colors.btnPrimaryText }]}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>No files in this folder</Text>
        <TouchableOpacity 
          style={[styles.centerAddButton, { backgroundColor: colors.btnPrimaryBg }]}
          onPress={() => setAddMenuVisible(true)}
        >
          <Text style={[styles.addButtonText, { color: colors.btnPrimaryText }]}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]} >
            <FileHeader 
              currentFolder={currentFolder}
              onBack={handleBackPress}
              colors={colors}
            />

            <View style={[styles.filesContainer, { backgroundColor: colors.bgSecondary }]}>
              <FlatList
                data={allItems}
                keyExtractor={(item) => item.type === 'folder' ? item.id : item.oid}
                ListEmptyComponent={emptyFiles}
                scrollEnabled={true}
                renderItem={({ item }) => (
                  <FileRow 
                    item={item}
                    colors={colors}
                    onPress={handleItemPress}
                  />
                )}
              />
            </View>

            <FilePreviewModal
              visible={previewModalVisible}
              selectedFile={selectedFile}
              onClose={() => setPreviewModalVisible(false)}
              allFiles={visibleFiles}
              colors={colors}
            />

            {/* Upload Progress Indicator - floats above FAB */}
            {uploadProgress && (
              <View style={[styles.progressContainer, { backgroundColor: colors.bgSecondary }]}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
                    {uploadProgress.completed ? 'Upload Complete' : 'Uploading...'}
                  </Text>
                  {uploadProgress.completed && (
                    <TouchableOpacity onPress={handleDismissProgress}>
                      <Text style={[styles.dismissButton, { color: colors.btnPrimaryBg }]}>{'\u2715'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {uploadProgress.current} of {uploadProgress.total} files
                </Text>
                {uploadProgress.fileName && (
                  <Text style={[styles.progressFileName, { color: colors.textSecondary }]} numberOfLines={1}>
                    {uploadProgress.fileName}
                  </Text>
                )}
                {!uploadProgress.completed && (
                  <View style={[styles.progressBar, { backgroundColor: colors.textSecondary + '40' }]}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          backgroundColor: colors.btnPrimaryBg,
                          width: `${(uploadProgress.current / uploadProgress.total) * 100}%`
                        }
                      ]} 
                    />
                  </View>
                )}
              </View>
            )}

            {/* Floating Action Button - only show when there are files */}
            {allItems.length > 0 && !uploading && (
              <TouchableOpacity 
                style={[styles.fab, { backgroundColor: colors.btnPrimaryBg }]}
                onPress={() => setAddMenuVisible(true)}
              >
                <Text style={[styles.fabText, { color: colors.btnPrimaryText }]}>+</Text>
              </TouchableOpacity>
            )}

            {/* Upload Indicator */}
            {uploading && (
              <View style={[styles.uploadingOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
                <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
                <Text style={[styles.uploadingText, { color: colors.textPrimary }]}>Uploading...</Text>
              </View>
            )}

            {/* Add Menu Modal */}
            <Modal
              visible={addMenuVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setAddMenuVisible(false)}
            >
              <TouchableOpacity 
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setAddMenuVisible(false)}
              >
                <View style={[styles.menuContainer, { backgroundColor: colors.bgSecondary }]}>
                  <TouchableOpacity 
                    style={[styles.menuItem, { borderBottomColor: colors.textSecondary }]}
                    onPress={handleAddFile}
                  >
                    <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>📄 Add File</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={handleAddFolder}
                  >
                    <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>📁 Add Multiple Files</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  filesContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  centerAddButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  addButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    left: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dismissButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressFileName: {
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default Files;