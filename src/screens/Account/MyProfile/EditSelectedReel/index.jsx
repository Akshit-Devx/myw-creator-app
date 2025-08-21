import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';

import {useSelector} from 'react-redux';
import {uploadData} from 'aws-amplify/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute, useNavigation} from '@react-navigation/native';

import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';
import Button from '../../../../components/elements/Button';
import ChangeReelModal from '../../../../components/modals/ChangeReelModal';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';
import {updateInfluencerPortfolioVideoAPI} from '../../../../services/handleApi';

const EditSelectedReelScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {onBoarding} = useSelector(state => state?.onBoarding);

  const item = route.params?.item;

  const [videoDetails, setVideoDetails] = useState(null);
  const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);

  const handleSelectLogo = useCallback(async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const file = asset.uri;
      const fileName = asset.fileName;
      const fileType = asset.type;
      setVideoDetails(prev => ({
        ...prev,
        brandLogo: {uri: file, fileName, fileType},
      }));
    } catch (error) {
      console.error('error: in handleSelectLogo', error);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      if (
        !item?.id ||
        !videoDetails?.influencerId ||
        !videoDetails?.categoryId
      ) {
        Alert.alert('Missing required video details.');
        return;
      }

      const payload = {
        id: item?.id,
        influencerId: videoDetails.influencerId,
        categoryId: videoDetails.categoryId,
        isArchived: true,
      };

      await updateInfluencerPortfolioVideoAPI(payload);
      navigation.goBack();
    } catch (error) {
      console.error('error: Error archiving the video', error);
    }
  }, [
    navigation,
    videoDetails?.categoryId,
    item?.id,
    videoDetails?.influencerId,
  ]);

  const handleSaveReel = useCallback(async reel => {
    try {
      setVideoDetails(prev => ({
        ...prev,
        videoUrl: reel.media_url || prev?.videoUrl || '',
        thumbnailUrl: reel.thumbnail_url || prev?.thumbnailUrl || '',
      }));
      setIsChangeModalVisible(false);
    } catch (error) {
      console.error('An error occurred while updating the reel.', error);
    }
  }, []);

  const uploadBrandLogo = useCallback(
    async brandLogo => {
      try {
        const key = `brand-logos/${item?.id}-${brandLogo.fileName
          .split('.')
          .slice(0, -1)
          .join('')}-${Date.now()}`;
        const response = await fetch(brandLogo?.uri);
        const blob = await response.blob();
        const res = await uploadData({
          key,
          data: blob,
          options: {
            contentType: brandLogo?.fileType,
            accessLevel: 'guest',
          },
        }).result;
        return `public/${res.key}`;
      } catch (error) {
        console.error(
          'An error occurred while uploading the brand logo.',
          error,
        );
        return null;
      }
    },
    [item],
  );

  const handleUploadBrandLogo = useCallback(
    async brandLogo => {
      try {
        if (brandLogo?.uri?.startsWith('https://')) {
          return item?.brandLogo;
        } else {
          return await uploadBrandLogo(brandLogo);
        }
      } catch (error) {
        console.error('An error occurred while updating the reel.', error);
      }
    },
    [uploadBrandLogo, item?.brandLogo],
  );

  const handleSave = useCallback(async () => {
    try {
      const payload = {
        id: item?.id,
        influencerId: videoDetails?.influencerId || '',
        categoryId: videoDetails?.categoryId || '',
      };

      if (videoDetails?.brandLogo?.uri) {
        payload.brandLogo = await handleUploadBrandLogo(
          videoDetails?.brandLogo,
        );
      }

      if (videoDetails?.videoUrl !== item?.videoUrl) {
        payload.videoUrl = videoDetails.videoUrl;
      }

      if (
        videoDetails?.thumbnailUrl &&
        videoDetails.thumbnailUrl !== getMediaURL(item?.thumbnailUrl)
      ) {
        payload.thumbnailUrl = videoDetails.thumbnailUrl;
      }
      await updateInfluencerPortfolioVideoAPI(payload);

      navigation.goBack();
    } catch (error) {
      console.error('An error occurred while updating the reel.', error);
    }
  }, [
    handleUploadBrandLogo,
    item?.id,
    item?.thumbnailUrl,
    item?.videoUrl,
    navigation,
    videoDetails?.brandLogo,
    videoDetails?.categoryId,
    videoDetails?.influencerId,
    videoDetails?.thumbnailUrl,
    videoDetails?.videoUrl,
  ]);

  const handleClose = useCallback(() => {
    setIsChangeModalVisible(false);
  }, []);

  useEffect(() => {
    if (item) {
      setVideoDetails({
        ...item,
        brandLogo: item?.brandLogo ? {uri: getMediaURL(item?.brandLogo)} : '',
        thumbnailUrl: item?.thumbnailUrl ? getMediaURL(item?.thumbnailUrl) : '',
      });
    }
  }, [item]);

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Edit Reel"
        onLeftPress={() => navigation.goBack()}
      />
      <View className="flex-1 p-5 flex-col gap-5">
        <View className="flex flex-row justify-between gap-2">
          <View className="flex-1 border border-gray-200 rounded-lg p-2 flex-col gap-2">
            <Text className="text-center text-base text-gray-600 font-semibold">
              Reel
            </Text>
            <View className="w-[100] h-[154] rounded-lg overflow-hidden">
              <Image
                source={{uri: videoDetails?.thumbnailUrl}}
                className="w-full h-full"
              />
              <TouchableOpacity
                onPress={() => setIsChangeModalVisible(true)}
                className="absolute top-[8] right-[8] bg-white/50 rounded-lg p-1">
                <Icons.EditIcon width={20} height={20} color={'blue'} />
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1 border border-gray-200 rounded-lg p-2 flex-col gap-2 items-center">
            <Text className="text-center text-base text-gray-600 font-semibold">
              Brand Logo
            </Text>
            {videoDetails?.brandLogo?.uri ? (
              <View className="w-[100] h-[100] rounded-lg overflow-hidden bg-[#fafafa] border border-dashed border-[#ccc] justify-center items-center">
                <Image
                  source={{uri: videoDetails?.brandLogo?.uri}}
                  className="w-full h-full"
                />
                <TouchableOpacity
                  onPress={handleSelectLogo}
                  className="absolute top-[8] right-[8] bg-white/50 rounded-lg p-1">
                  <Icons.EditIcon width={20} height={20} color={'blue'} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSelectLogo}
                className="w-[100] h-[100] rounded-lg overflow-hidden bg-[#fafafa] border border-dashed border-[#ccc] justify-center items-center">
                <Text className="text-2xl text-gray-600 font-semibold">+</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="flex-row gap-3 justify-between">
          <Button
            title="Delete"
            variant="secondary"
            onPress={handleDelete}
            className="rounded-lg border-red-500 flex-1"
            textClassName="text-red-500"
          />
          <Button
            title="Save"
            onPress={handleSave}
            className="rounded-lg flex-1"
          />
        </View>
      </View>
      <ChangeReelModal
        visible={isChangeModalVisible}
        token={onBoarding?.instagramToken?.refreshToken}
        onClose={handleClose}
        handleSaveReel={handleSaveReel}
      />
    </View>
  );
};

export default EditSelectedReelScreen;
