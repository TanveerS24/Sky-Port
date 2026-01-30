import { View, Text, Pressable, StyleSheet, Modal, Image, Dimensions, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
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
  const [pdfLoading, setPdfLoading] = useState(true);
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
    setPdfLoading(true); // Reset loading state when switching files
    resetZoom();
  };

  if (!selectedFile || allFiles.length === 0) return null;

  const currentFile = allFiles[currentIndex];
  const isImage = isImageFile(currentFile.mimeType);
  const isVideo = isVideoFile(currentFile.mimeType);
  const isPDF = currentFile.mimeType === 'application/pdf';

  console.log('Current file:', currentFile.name, 'Type:', currentFile.mimeType);
  console.log('Is Image:', isImage, 'Is Video:', isVideo, 'Is PDF:', isPDF);

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

        {/* File Name - Show for all file types */}
        {!isFullscreen && (
          <View style={styles.fileNameContainer}>
            <Text style={[styles.fileNameText, { color: colors.textPrimary }]} numberOfLines={1}>
              {currentFile.name}
            </Text>
            {!isImage && !isVideo && (
              <Text style={[styles.fileTypeLabel, { color: colors.textSecondary }]}>
                {currentFile.mimeType}
              </Text>
            )}
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

              const fileIsImage = isImageFile(file.mimeType);
              const fileIsVideo = isVideoFile(file.mimeType);

              return (
                <GestureHandlerRootView key={file.oid} style={styles.fileContainer}>
                  <PinchGestureHandler onGestureEvent={handlePinch}>
                    <Animated.View style={[animatedStyle, styles.fileContent]}>
                      {fileIsImage && (
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

        {/* PDF Viewer */}
        {isPDF && !isFullscreen && (
          <View style={styles.pdfContainer}>
            {pdfLoading && (
              <View style={styles.pdfLoadingContainer}>
                <ActivityIndicator size="large" color={colors.btnPrimaryBg} />
                <Text style={[styles.pdfLoadingText, { color: colors.textSecondary }]}>
                  Loading PDF...
                </Text>
              </View>
            )}
            <WebView
              source={{ uri: `https://docs.google.com/viewer?url=${encodeURIComponent(currentFile.cloudinaryUrl)}&embedded=true` }}
              style={styles.pdfWebView}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              bounces={true}
              showsVerticalScrollIndicator={true}
              onLoadStart={() => setPdfLoading(true)}
              onLoadEnd={() => setPdfLoading(false)}
              onError={() => {
                setPdfLoading(false);
                console.error('Failed to load PDF');
              }}
            />
          </View>
        )}

        {/* Non-Image/Video/PDF File Preview */}
        {!isImage && !isVideo && !isPDF && (
          <View style={styles.nonImagePreview}>
            <Ionicons 
              name={isPDF ? "document-text" : "document"}
              size={100} 
              color={colors.btnPrimaryBg}
              style={{ marginBottom: 20 }}
            />
            <Text style={[styles.fileNameText, { color: colors.textPrimary, fontSize: 18, fontWeight: 'bold' }]}>
              {currentFile.name}
            </Text>
            <Text style={[styles.fileTypeText, { color: colors.textSecondary, marginTop: 8 }]}>
              {isPDF ? 'PDF Document' : 'Document'}
            </Text>
            <Text style={[styles.fileTypeText, { color: colors.textSecondary, marginTop: 16, fontSize: 14 }]}>
              {isPDF ? 'Download to view the PDF' : 'Download to view this file'}
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
  fileTypeLabel: {
    fontSize: 12,
    marginTop: 4,
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
  pdfContainer: {
    flex: 1,
    marginTop: 140,
    marginBottom: 80,
    marginHorizontal: 10,
  },
  pdfWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pdfLoadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 10,
    alignItems: 'center',
  },
  pdfLoadingText: {
    marginTop: 10,
    fontSize: 14,
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
