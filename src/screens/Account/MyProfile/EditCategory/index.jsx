import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Image,
  Platform,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {useFocusEffect, useRoute, useNavigation} from '@react-navigation/native';

import {Icons} from '../../../../assets/icons';
import {tagOptions} from '../../../../utility/common';
import {getMediaURL} from '../../../../utility/helper';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import Dropdown from '../../../../components/elements/Dropdown';
import {fetchInfluencerById} from '../../../../store/slices/onBoarding';
import SelectReelModal from '../../../../components/modals/SelectReelModal';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';
import {
  WEBSITE_URL,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_LOGIN_SCOPES,
} from '../../../../config/envConfig';
import {
  updateInfluencerPortfolioVideoAPI,
  createInfluencerPortfolioVideoAPI,
  updateInfluencerPortfolioCategoryAPI,
  getInfluencerPortfolioCategoryByIdAPI,
  getInfluencerPortfolioVideosByCategoryIdAPI,
} from '../../../../services/handleApi';

const EditCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const categoryId = route.params?.categoryId;

  const {onBoarding} = useSelector(state => state?.onBoarding);
  const influencerId = onBoarding?.id;

  const [title, setTitle] = useState('');
  const [localTagList, setLocalTagList] = useState([]);
  const [customLinks, setCustomLinks] = useState([
    'https://www.youtube.com/watch?v=y7MW7d8fb1Y&list=RDBzbdZAlURKE&index=27&ab_channel=ZeeMusicCompany',
  ]);
  const [linkInput, setLinkInput] = useState('');
  const [savedVideos, setSavedVideos] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [errors, setErrors] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isReelModalVisible, setIsReelModalVisible] = useState(false);

  const handleRemoveVideo = useCallback(
    async videoId => {
      try {
        const payload = {
          id: videoId,
          influencerId,
          categoryId,
          isArchived: true,
        };

        await updateInfluencerPortfolioVideoAPI(payload);

        setSavedVideos(prev => prev.filter(video => video.id !== videoId));
      } catch (error) {
        console.error('Error archiving video:', error);
      }
    },
    [categoryId, influencerId],
  );

  const handleAddLink = useCallback(() => {
    const trimmed = linkInput.trim();
    if (!trimmed) {
      Alert.alert('Please enter a link!');
      return;
    }

    const relaxedUrlRegex =
      /^(https?:\/\/)?([\w.-]+)(\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    if (!relaxedUrlRegex.test(trimmed)) {
      return Alert.alert('Please enter a valid link!');
    }

    const normalizedLink =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://${trimmed}`;

    if (customLinks.includes(normalizedLink)) {
      return Alert.alert('Link already exists!');
    }

    setCustomLinks(prev => [...prev, normalizedLink]);
    setLinkInput('');
  }, [customLinks, linkInput]);

  const handleRemoveLink = useCallback(
    index => {
      const updatedLinks = customLinks.filter((_, i) => i !== index);
      setCustomLinks(updatedLinks);
    },
    [customLinks],
  );

  const handleSave = useCallback(async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Category title cannot be empty!');
        return;
      }
      if (!influencerId) {
        Alert.alert('Influencer ID is missing.');
        return;
      }

      const payload = {
        id: categoryId,
        customLinks,
        isArchived: false,
        title: title.trim(),
        tags: localTagList,
      };

      await updateInfluencerPortfolioCategoryAPI(payload);
      navigation.goBack();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [categoryId, customLinks, influencerId, localTagList, navigation, title]);

  const handleDelete = useCallback(async () => {
    try {
      if (!categoryId) {
        Alert.alert('Category ID is missing.');
        return;
      }

      Alert.alert(
        'Delete Category',
        'Are you sure you want to delete this category?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const payload = {
                id: categoryId,
                isArchived: true,
              };

              await updateInfluencerPortfolioCategoryAPI(payload);
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [categoryId, navigation]);

  const handleSaveReel = useCallback(
    async reels => {
      try {
        const savedVideosPromises = reels.map(async reel => {
          const videoPayload = {
            influencerId,
            categoryId,
            videoUrl: reel.media_url,
            thumbnailUrl: reel.thumbnail_url || '',
            position: savedVideos.length + 1,
            permalink: reel.permalink,
            caption: reel.caption || '',
            insights: {
              comments: reel.comments_count || 0,
              likes: reel.like_count || 0,
            },
            brandLogo: '',
          };

          const response = await createInfluencerPortfolioVideoAPI(
            videoPayload,
          );
          return {
            ...videoPayload,
            id: response?.data?.id || null,
          };
        });

        await Promise.all(savedVideosPromises);

        const updatedVideos = await getInfluencerPortfolioVideosByCategoryIdAPI(
          categoryId,
        );
        const unarchivedVideos = updatedVideos.filter(
          video => !video.isArchived,
        );

        setSavedVideos(unarchivedVideos || []);
        setIsReelModalVisible(false);
      } catch (error) {
        console.error('Error saving reels:', error);
      }
    },
    [categoryId, influencerId, savedVideos.length],
  );

  const handleConnectInstagram = useCallback(() => {
    setIsReelModalVisible(false);
    const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${WEBSITE_URL}/configure/instagram/&response_type=code&scope=${INSTAGRAM_LOGIN_SCOPES}`;
    navigation.navigate('Detail', {
      screen: 'InstagramConnect',
      params: {
        url,
      },
    });
  }, [navigation]);

  const fetchSavedVideos = useCallback(async () => {
    if (!categoryId) {
      return;
    }
    try {
      const videos = await getInfluencerPortfolioVideosByCategoryIdAPI(
        categoryId,
      );
      const unarchivedVideos = videos.filter(video => !video.isArchived);

      setSavedVideos(unarchivedVideos || []);
    } catch (error) {
      console.error('Error fetching saved videos:', error);
    }
  }, [categoryId]);

  const fetchCategoryDetails = useCallback(async () => {
    if (!categoryId) {
      return;
    }
    try {
      const category = await getInfluencerPortfolioCategoryByIdAPI(categoryId);
      if (category) {
        setTitle(category.title || '');
        setValue(category.tags || []);
        setCustomLinks(category.customLinks || []);
      }
    } catch (err) {
      console.error('Error loading category:', err);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId, fetchCategoryDetails]);

  useEffect(() => {
    fetchSavedVideos();
  }, [categoryId, fetchSavedVideos]);

  useFocusEffect(
    useCallback(() => {
      fetchInfluencerById(influencerId);
      fetchSavedVideos();
      fetchCategoryDetails();
    }, [influencerId, fetchSavedVideos, fetchCategoryDetails]),
  );

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Edit Category"
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        className="grow p-5 relative"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView className="grow" showsVerticalScrollIndicator={false}>
          <InputField
            placeholder={''}
            label={'Category Title'}
            value={title}
            onChangeText={text => setTitle(text)}
            error={errors.title}
          />
          <View className="flex-col gap-2 mb-4">
            <Text className="text-gray-700 text-md font-medium">Tags</Text>
            <Dropdown
              open={open}
              value={value}
              items={tagOptions?.map(tag => ({label: tag, value: tag}))}
              setOpen={setOpen}
              setValue={setValue}
              multiple={true}
            />
          </View>
          <View className="mb-4 flex-col">
            <Text className="text-gray-700 text-lg font-medium">
              Add Collabs
            </Text>
            <Text className="text-[#a2a2a2] mb-2 text-md font-medium">
              Add ContentTotal Videos: 1
            </Text>
            <View className="bg-[#f5f5f5] w-full h-[200px] rounded-lg justify-center items-center p-8">
              <Button
                title="+ Add Content"
                className="w-full rounded-xl"
                onPress={() => setIsReelModalVisible(true)}
              />
            </View>
          </View>
          <FlatList
            data={savedVideos}
            renderItem={({item}) => (
              <View className="border border-gray-300 rounded-lg p-4 flex-row items-center gap-4 relative">
                <Video
                  style={styles.video}
                  muted
                  paused
                  source={{uri: getMediaURL(item?.videoUrl)}}
                />
                <View className="flex-col gap-1">
                  {item?.brandLogo && (
                    <View className="flex-row items-center gap-1">
                      <Text className="text-gray-500 text-sm">
                        Partnered with
                      </Text>
                      <Image
                        source={{uri: getMediaURL(item?.brandLogo)}}
                        className="w-[16] h-[16] rounded-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <Button
                    title="Edit Details"
                    variant="secondary"
                    rightIcon={<Icons.EditIcon width={16} height={16} />}
                    className="rounded-lg"
                    onPress={() =>
                      navigation.navigate('EditSelectedReel', {item})
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveVideo(item?.id)}
                  className="w-[24] h-[24] justify-center items-center absolute top-2 right-2 border border-[#1846e7] rounded-full">
                  <Icons.CrossIcon width={18} height={18} fill="#1846e7" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            className="mb-4"
            ItemSeparatorComponent={() => <View className="h-[10]" />}
          />
          <View className="mb-4">
            <Text className="text-gray-700 text-lg font-medium">
              More Links
            </Text>
            <View className="flex-row gap-2 mb-4">
              <InputField
                placeholder="Enter username or paste link"
                onChangeText={text => setLinkInput(text)}
                value={linkInput}
                containerClassName={'flex-1'}
              />
              <Button
                title="Add More +"
                onPress={handleAddLink}
                className="rounded-lg px-1"
              />
            </View>
            <View>
              {customLinks?.map((link, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-2 border border-gray-400 p-2 rounded-md">
                  <Text className="flex-1" numberOfLines={1}>
                    {link}
                  </Text>
                  <TouchableOpacity
                    className="border border-[#1846e7] rounded-full p-1"
                    onPress={() => handleRemoveLink(index)}>
                    <Icons.CrossIcon width={18} height={18} fill="#1846e7" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <View className="h-[150px]" />
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="flex-row gap-2 z-50 absolute bottom-2 right-[20] left-[20]">
        <Button
          title="Delete"
          variant="secondary"
          className="border border-[#ff4d4f] rounded-lg flex-1"
          textClassName="text-[#ff4d4f]"
          onPress={handleDelete}
        />
        <Button
          title="Save"
          onPress={handleSave}
          disabled={isSaving}
          className="rounded-lg flex-1"
        />
      </View>

      <SelectReelModal
        visible={isReelModalVisible}
        onClose={() => {
          setIsReelModalVisible(false);
        }}
        handleConnectInstagram={handleConnectInstagram}
        token={onBoarding?.instagramToken?.refreshToken}
        handleSaveReel={handleSaveReel}
      />
    </View>
  );
};

export default EditCategoryScreen;

const styles = StyleSheet.create({
  video: {
    width: 48,
    height: 76,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
