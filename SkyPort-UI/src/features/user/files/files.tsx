import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { useTheme } from '../../../context/themeProvider.context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import getItemsInFolder from '../../../helpers/itemsInFolder.helper';
import { getFiles } from '../../../api/files.api';
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
        setError(err.response?.data?.message || 'Failed to load files');
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
    if (item.type === 'folder') {
      const newPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
      setCurrentFolder(newPath);
    } else {
      setSelectedFile(item);
      setPreviewModalVisible(true);
    }
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
          <Text style={{ color: colors.error, marginBottom: 10 }}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: colors.textSecondary }}>No files in this folder</Text>
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
});

export default Files;