import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFileIcon } from '../helpers/fileOperations.helper';

interface FileRowProps {
  item: any;
  colors: any;
  onPress: (item: any) => void;
}

export const FileRow = ({ item, colors, onPress }: FileRowProps) => {
  if (item.type === 'folder') {
    return (
      <Pressable 
        style={[styles.fileRow, { borderBottomColor: colors.borderMuted }]}
        onPress={() => onPress(item)}
      >
        <View style={[styles.iconWrapper, { backgroundColor: colors.bgTertiary }]}>
          <Ionicons 
            name="folder-outline"
            size={32} 
            color={colors.btnPrimaryBg}
          />
        </View>
        
        <View style={styles.fileInfo}>
          <Text style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>

        <Ionicons 
          name="chevron-forward"
          size={20} 
          color={colors.textMuted}
        />
      </Pressable>
    );
  }

  return (
    <Pressable 
      style={[styles.fileRow, { borderBottomColor: colors.borderMuted }]}
      onPress={() => onPress(item)}
    >
      <View style={[styles.iconWrapper, { backgroundColor: colors.bgTertiary }]}>
        <Ionicons 
          name={getFileIcon(item.name) as any} 
          size={32} 
          color={colors.btnPrimaryBg}
        />
      </View>
      
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.metaInfo}>
          <Text style={[styles.uploadedBy, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.uploadedBy}
          </Text>
          <Text style={[styles.uploadedAt, { color: colors.textMuted }]}>
            {item.uploadedAt}
          </Text>
        </View>
      </View>

      <Ionicons 
        name="eye"
        size={20} 
        color={colors.btnPrimaryBg}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  uploadedBy: {
    fontSize: 12,
  },
  uploadedAt: {
    fontSize: 12,
  },
});
