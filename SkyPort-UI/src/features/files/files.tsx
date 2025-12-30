import {View, Text, Pressable, StyleSheet, FlatList} from 'react-native';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import files from '../../testData/Files';
import getItemsInFolder from '../../helpers/itemsInFolder.helper';

const Files = () => {
    const { colors } = useTheme();
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const router = useRouter();

  const { folders, files: visibleFiles } = getItemsInFolder(files, currentFolder);
  const allItems = [...folders, ...visibleFiles];
  
  // Add back navigation item if not at root
  const itemsWithBack = currentFolder 
    ? [{ type: 'back' as const, name: '..', id: 'back' }, ...allItems]
    : allItems;
  
  const handleItemPress = (item: any) => {
    if (item.type === 'back') {
      // Go back to parent folder
      const pathParts = currentFolder?.split('/');
      if (pathParts && pathParts.length > 1) {
        setCurrentFolder(pathParts.slice(0, -1).join('/'));
      } else {
        setCurrentFolder(null);
      }
    } else if (item.type === 'folder') {
      // Navigate into folder
      const newPath = currentFolder ? `${currentFolder}/${item.name}` : item.name;
      setCurrentFolder(newPath);
    }
    // Files don't do anything for now
  };
  const emptyFiles =() => {
    return (
      <View>
        <Text style={{ color: colors.textPrimary }}>You can see your shared folders here</Text>
      </View>
    )
  };
    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]} >
            <Pressable style={styles.header} onPress={() => router.back()}>
              <Ionicons
                  name="arrow-back" 
                  size={24} 
                  color={colors.textPrimary} 
              />
              <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                  Shared Files
              </Text>
            </Pressable>
        <View style={[styles.sharedFilesContainer, { backgroundColor: colors.bgSecondary }]}>
                <View style={styles.sharedFilesList}>
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.rowHeader, styles.fileName, {color: colors.textPrimary}]}>File Name</Text>
                    <Text style={[styles.cell, styles.rowHeader, {color: colors.textPrimary}]}>Uploaded By</Text>
                    <Text style={[styles.cell, styles.rowHeader, {color: colors.textPrimary}]}>Size</Text>
                    <Text style={[styles.cell, styles.rowHeader, {color: colors.textPrimary}]}>Uploaded At</Text>
                  </View>
                  
                  <FlatList
                    data={itemsWithBack}
                    keyExtractor={(item) => item.type === 'folder' || item.type === 'back' ? item.id : item.oid}
                    ListEmptyComponent={emptyFiles}
                    renderItem={({ item }) => (
                      <Pressable 
                        style={styles.row}
                        onPress={() => handleItemPress(item)}
                      >
                        <Text style={[styles.cell, styles.fileName, {color: colors.textSecondary}]}>
                          <Ionicons 
                            name={
                              item.type === 'back' ? "arrow-back-outline" :
                              item.type === 'folder' ? "folder-open-outline" : "document-outline"
                            } 
                            size={16} 
                            color={colors.textMuted }
                          />
                          {'  '}{item.name}
                        </Text>
                        <Text style={[styles.cell, {color: colors.textPrimary}]}>
                          {item.type === 'file' ? item.uploadedBy : '-'}
                        </Text>
                        <Text style={[styles.cell, {color: colors.textPrimary}]}>
                          {item.type === 'file' ? item.size : '-'}
                        </Text>
                        <Text style={[styles.cell, {color: colors.textPrimary}]}>
                          {item.type === 'file' ? item.uploadedAt : '-'}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  header: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 10,
    flexDirection: 'row',
    fontSize: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sharedFilesContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sharedFilesList: {
    marginTop: 10,
    maxHeight: '70%',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  rowHeader: {
    fontWeight: 'bold',
  },
  fileName: {
    flex: 2,
    textAlign: 'left',
  },
  
});
export default Files;