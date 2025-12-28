import {Text, View, StyleSheet, Pressable, ScrollView, FlatList} from 'react-native';
import { useTheme } from '../../context/themeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import files from '../../testData/Files';
import getItemsInFolder from '../../helpers/itemsInFolder.helper';

const Home = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

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
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <Pressable 
        style={styles.profileIcon} 
        onPress={() => router.push('/profile')}
      >
        <Ionicons 
          name="person-circle-outline" 
          size={32} 
          color={colors.textPrimary} 
        />
      </Pressable>
      <Text style={[styles.title, { color: colors.headingPrimary }]}>Sky-Port</Text>

      <View style={styles.sharedFilesContainer}>
        <Text style={{ color: colors.textPrimary }}>Your Shared Files</Text>
        <View style={styles.sharedFilesList}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.rowHeader, styles.fileName]}>File Name</Text>
            <Text style={[styles.cell, styles.rowHeader]}>Uploaded By</Text>
            <Text style={[styles.cell, styles.rowHeader]}>Size</Text>
            <Text style={[styles.cell, styles.rowHeader]}>Uploaded At</Text>
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
                <Text style={[styles.cell, styles.fileName]}>
                  <Ionicons 
                    name={
                      item.type === 'back' ? "arrow-back-outline" :
                      item.type === 'folder' ? "folder-open-outline" : "document-outline"
                    } 
                    size={16} 
                    color={colors.textPrimary}
                  />
                  {' '}{item.name}
                </Text>
                <Text style={styles.cell}>
                  {item.type === 'file' ? item.uploadedBy : '-'}
                </Text>
                <Text style={styles.cell}>
                  {item.type === 'file' ? item.size : '-'}
                </Text>
                <Text style={styles.cell}>
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
  title: {
    fontSize: 32,
    marginBottom: 10,
    fontWeight: 'bold',
    top: 55,
    left: 20,
    position: 'absolute',
  },
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  sharedFilesContainer: {
    marginTop: 120,
    marginHorizontal: 20,
  },
  sharedFilesList: {
    marginTop: 10,
    maxHeight: '70%',
    backgroundColor: '#F3BDBD3E',
    height: 700,
    borderRadius: 10,
    padding: 10,
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
  },
  rowHeader: {
    fontWeight: 'bold',
  },
  fileName: {
    flex: 2,
    textAlign: 'left',
  }
});

export default Home;