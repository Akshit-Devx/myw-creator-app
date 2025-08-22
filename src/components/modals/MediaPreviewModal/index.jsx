import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Video from 'react-native-video';

import {Icons} from '../../../assets/icons';
import {getMediaURL} from '../../../utility/helper';

const MediaPreviewModal = ({visible, onClose, media, index}) => {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Navigate to previous media
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setImageLoading(true);
      setImageError(false);
      setVideoLoading(true);
      setVideoError(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next media
  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setImageLoading(true);
      setImageError(false);
      setVideoLoading(true);
      setVideoError(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClose = () => {
    setCurrentIndex(null);
    onClose();
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleVideoLoad = () => {
    setVideoLoading(false);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoLoading(false);
    setVideoError(true);
  };

  useEffect(() => {
    setCurrentIndex(index);
    setImageLoading(true);
    setImageError(false);
    setVideoLoading(true);
    setVideoError(false);
  }, [index]);

  const renderPreview = () => {
    const item = media[currentIndex];
    if (!item) return null;

    return (
      <View className="w-full h-full relative">
        {item.type === 'POST' ? (
          <>
            {imageLoading && (
              <View className="absolute inset-0 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#666" />
                <Text className="text-gray-600 mt-2">Loading image...</Text>
              </View>
            )}
            {imageError ? (
              <View className="absolute inset-0 justify-center items-center bg-gray-100">
                <Icons.CrossIcon width={48} height={48} color="#999" />
                <Text className="text-gray-600 mt-2 text-center">
                  Failed to load image
                </Text>
                <TouchableOpacity
                  className="mt-2 px-4 py-2 bg-blue-500 rounded"
                  onPress={() => {
                    setImageError(false);
                    setImageLoading(true);
                  }}>
                  <Text className="text-white">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Image
                source={{uri: getMediaURL(item.link)}}
                className="w-full h-full"
                resizeMode="contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </>
        ) : (
          <>
            {videoLoading && (
              <View className="absolute inset-0 justify-center items-center bg-gray-100 z-10">
                <ActivityIndicator size="large" color="#666" />
                <Text className="text-gray-600 mt-2">Loading video...</Text>
              </View>
            )}
            {videoError ? (
              <View className="absolute inset-0 justify-center items-center bg-gray-100">
                <Icons.CrossIcon width={48} height={48} color="#999" />
                <Text className="text-gray-600 mt-2 text-center">
                  Failed to load video
                </Text>
                <TouchableOpacity
                  className="mt-2 px-4 py-2 bg-blue-500 rounded"
                  onPress={() => {
                    setVideoError(false);
                    setVideoLoading(true);
                  }}>
                  <Text className="text-white">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Video
                source={{uri: getMediaURL(item.link)}}
                style={styles.video}
                resizeMode="contain"
                repeat={true}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <TouchableOpacity
            className="absolute top-2 right-2 z-10 bg-gray-200 p-2 rounded-full"
            onPress={handleClose}>
            <Icons.CrossIcon width={24} height={24} />
          </TouchableOpacity>
          <View className="w-full h-[350]">{renderPreview()}</View>
          <View className="absolute bottom-[50%] left-2 right-2 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={goToPrevious}
              disabled={currentIndex === 0}
              className="bg-white/50 p-2 rounded-full">
              <Icons.BackIcon width={24} height={24} fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNext}
              disabled={currentIndex === media.length - 1}
              style={{transform: [{rotate: '180deg'}]}}
              className="bg-white/50 p-2 rounded-full">
              <Icons.BackIcon width={24} height={24} fill="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPreviewModal;

const styles = StyleSheet.create({
  video: {width: '100%', height: '100%'},
});
