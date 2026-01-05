import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FileHeaderProps {
  currentFolder: string | null;
  onBack: () => void;
  colors: any;
}

export const FileHeader = ({ currentFolder, onBack, colors }: FileHeaderProps) => {
  const getFolderDisplayName = () => {
    if (!currentFolder || currentFolder === 'root') return 'Files';
    const parts = currentFolder.split('/');
    return parts[parts.length - 1];
  };

  return (
    <>
      <Pressable style={styles.header} onPress={onBack}>
        <Ionicons
          name="arrow-back" 
          size={24} 
          color={colors.textPrimary} 
        />
        <Text style={[styles.headerText, { color: colors.textPrimary }]}>
          Shared Files
        </Text>
      </Pressable>

      <View style={styles.folderHeader}>
        {currentFolder && currentFolder !== 'root' && (
          <Pressable 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={20} color={colors.btnPrimaryBg} />
          </Pressable>
        )}
        <Text style={[styles.folderTitle, { color: colors.textPrimary }]}>
          {getFolderDisplayName()}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 20,
    flexDirection: 'row',
    fontSize: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  folderHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
