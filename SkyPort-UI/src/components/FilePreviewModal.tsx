import { View, Text, Pressable, StyleSheet, Modal, Image, Dimensions, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { isImageFile, isVideoFile, downloadFile } from '../helpers/fileOperations.helper';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface FilePreviewModalProps {
  visible: boolean;
  selectedFile: any;
  onClose: () => void;
  allFiles: any[];
  colors: any;
}

export const FilePreviewModal = ({ 
  visible, 
  selectedFile, 
  onClose, 
  allFiles, 
  colors 
}: FilePreviewModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const scale = useSharedValue(1);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (selectedFile && allFiles.length > 0) {
      const index = allFiles.findIndex(f => f.oid === selectedFile.oid);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [selectedFile, allFiles]);

  const handlePinch = (event: any) => {
    scale.value = event.nativeEvent.scale;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const resetZoom = () => {
    scale.value = withSpring(1);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const file = allFiles[currentIndex];
      await downloadFile(file.cloudinaryUrl, file.name);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentPageIndex = Math.round(contentOffsetX / Dimensions.get('window').width);
    setCurrentIndex(currentPageIndex);
    resetZoom();
  };

  if (!selectedFile || allFiles.length === 0) return null;

  const currentFile = allFiles[currentIndex];
  const isImage = isImageFile(currentFile.mimeType);
  const isVideo = isVideoFile(currentFile.mimeType);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]}>
        {/* Close Button */}
        <Pressable 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={30} color={colors.textPrimary} />
        </Pressable>

        {/* File Name */}
        {!isFullscreen && (
          <View style={styles.fileNameContainer}>
            <Text style={[styles.fileNameText, { color: colors.textPrimary }]} numberOfLines={1}>
              {currentFile.name}
            </Text>
          </View>
        )}

        {/* Horizontal Scroll for Images/Videos */}
        {(isImage || isVideo) && !isFullscreen && (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            style={styles.scrollContainer}
          >
            {allFiles.map((file, index) => {
              // Only render current, previous, and next images
              if (Math.abs(index - currentIndex) > 1) return null;

              return (
                <GestureHandlerRootView key={file.oid} style={styles.fileContainer}>
                  <PinchGestureHandler onGestureEvent={handlePinch}>
                    <Animated.View style={[animatedStyle, styles.fileContent]}>
                      {isImage && file.mimeType.startsWith('image/') && (
                        <Pressable onPress={() => setIsFullscreen(true)}>
                          <Image
                            source={{ uri: file.cloudinaryUrl }}
                            style={styles.previewImage}
                            resizeMode="contain"
                          />
                        </Pressable>
                      )}
                    </Animated.View>
                  </PinchGestureHandler>
                </GestureHandlerRootView>
              );
            })}
          </ScrollView>
        )}

        {/* Fullscreen Mode */}
        {isFullscreen && (
          <Pressable 
            style={styles.fullscreenContainer}
            onPress={() => setIsFullscreen(false)}
          >
            <GestureHandlerRootView style={styles.fullscreenContent}>
              <PinchGestureHandler onGestureEvent={handlePinch}>
                <Animated.View style={animatedStyle}>
                  {isImage && (
                    <Image
                      source={{ uri: currentFile.cloudinaryUrl }}
                      style={styles.fullscreenImage}
                      resizeMode="contain"
                    />
                  )}
                </Animated.View>
              </PinchGestureHandler>
            </GestureHandlerRootView>
          </Pressable>
        )}

        {/* Non-Image File Preview */}
        {!isImage && !isVideo && (
          <View style={styles.nonImagePreview}>
            <Ionicons 
              name="document"
              size={80} 
              color={colors.btnPrimaryBg}
              style={{ marginBottom: 20 }}
            />
            <Text style={[styles.fileNameText, { color: colors.textPrimary }]}>
              {currentFile.name}
            </Text>
            <Text style={[styles.fileTypeText, { color: colors.textSecondary }]}>
              Tap download to view
            </Text>
          </View>
        )}

        {/* Download Button */}
        <Pressable 
          style={[styles.downloadButton, { backgroundColor: colors.btnPrimaryBg }]}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color={colors.btnPrimaryText} />
          ) : (
            <>
              <Ionicons name="download" size={20} color={colors.btnPrimaryText} />
              <Text style={[styles.downloadButtonText, { color: colors.btnPrimaryText }]}>
                Download
              </Text>
            </>
          )}
        </Pressable>

        {/* Scroll Indicator */}
        {(isImage || isVideo) && allFiles.length > 1 && !isFullscreen && (
          <View style={styles.scrollIndicator}>
            <Text style={{ color: colors.textSecondary }}>
              {currentIndex + 1} / {allFiles.length}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fileNameContainer: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    paddingVertical: 10,
    zIndex: 5,
  },
  fileNameText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  fileTypeText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: 60,
  },
  fileContainer: {
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height * 0.6,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  fullscreenContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  nonImagePreview: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 10,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
