import React from 'react';
import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';

import Video from 'react-native-video';

import {extractFileIdentifier, getMediaURL} from '../../../utility/helper';

const FilePreview = ({mediaUrl, type}) => {
  const handleViewPress = () => {
    const url = getMediaURL(mediaUrl);
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <View className="flex flex-col gap-2 rounded-xl p-4 bg-white border border-gray-200 w-full">
      <View className="flex flex-row items-center gap-2">
        <View className="w-12 h-12 rounded overflow-hidden">
          {type === 'POST' ? (
            <Image
              source={{uri: getMediaURL(mediaUrl)}}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <Video
              source={{uri: getMediaURL(mediaUrl)}}
              className="w-full h-full"
              paused={true}
              resizeMode="contain"
            />
          )}
        </View>
        <View className="flex flex-col gap-1 flex-1">
          <Text className="text-black text-sm font-semibold max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
            {extractFileIdentifier(mediaUrl)}
          </Text>
          <Text className="text-gray-500 text-xs font-normal">{''}</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <TouchableOpacity className="p-2" onPress={handleViewPress}>
            <Text className="text-blue-600 text-sm font-medium">View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FilePreview;
