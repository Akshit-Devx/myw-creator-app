import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import {updateInfluencerAPI} from '../../../../services/handleApi';
import {fetchInfluencerById} from '../../../../store/slices/onBoarding';
import FullScreenLoader from '../../../../components/common/FullScreenLoader';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';
import MultiSelectDropdown from '../../../../components/elements/MultiSelectDropdown';
import {
  WEBSITE_URL,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_LOGIN_SCOPES,
} from '../../../../config/envConfig';

const categoryList = [
  'Fashion',
  'Lifestyle',
  'Food',
  'Beauty',
  'Skincare',
  'Travel',
  'Technology',
  'Vloggers',
  'Health ',
  'Fitness',
  'Gaming',
  'Finance',
  'Automobile',
  'Photography',
];

const BasicDetailsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {onBoarding} = useSelector(state => state.onBoarding);

  const {
    control,
    watch,
    clearErrors,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: onBoarding?.name || '',
      aboutYou: onBoarding?.bio || '',
      location: onBoarding?.location || '',
      category: onBoarding?.tags?.map(tag => ({label: tag, value: tag})) || [],
    },
  });

  const [loading, setLoading] = useState(false);

  const handleDisconnect = useCallback(async () => {
    try {
      Alert.alert(
        'Disconnect Instagram',
        'Are you sure you want to disconnect your Instagram account?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              const payload = {
                id: onBoarding.id,
                oldInstagramToken: onBoarding?.instagramToken,
                instagramToken: {},
              };
              console.log('payload =--->', payload);
              const response = await updateInfluencerAPI(payload);
              dispatch(fetchInfluencerById(onBoarding?.id));
              console.log('response', response);
            },
          },
        ],
        {
          cancelable: true,
        },
      );
    } catch (error) {
      console.error('error', error);
    }
  }, [dispatch, onBoarding.id, onBoarding?.instagramToken]);

  const handleConnect = useCallback(() => {
    try {
      const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${WEBSITE_URL}/configure/instagram/&response_type=code&scope=${INSTAGRAM_LOGIN_SCOPES}`;
      navigation.navigate('Detail', {
        screen: 'InstagramConnect',
        params: {
          url,
        },
      });
    } catch (error) {
      console.error('error', error);
    }
  }, [navigation]);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const payload = {
        id: onBoarding.id,
        name: watch('name'),
        bio: watch('aboutYou'),
        location: watch('location'),
        tags: watch('category')?.map(tag => tag.value),
      };
      await updateInfluencerAPI(payload);
      dispatch(fetchInfluencerById(onBoarding?.id));
      navigation.goBack();
    } catch (error) {
      console.error('error', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, onBoarding.id, watch, navigation]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchInfluencerById(onBoarding?.id));
    }, [dispatch, onBoarding?.id]),
  );

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Account"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <KeyboardAvoidingView
        className="grow p-5"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView className="grow" showsVerticalScrollIndicator={false}>
          <View className="w-[100] h-[100] rounded-full overflow-hidden relative self-center">
            <Image
              source={{uri: getMediaURL(onBoarding?.profilePictureWithBg)}}
              className="w-full h-full"
            />
            <View className="absolute z-10 w-full h-full items-center justify-center bg-white/50">
              <Icons.CameraIcon width={20} height={20} />
            </View>
          </View>
          <View className="flex-col flex-1 gap-4">
            <Controller
              control={control}
              name="name"
              rules={{required: 'Your Name is required'}}
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Your Name"
                  value={value}
                  onChangeText={text => {
                    clearErrors('name');
                    onChange(text);
                  }}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="aboutYou"
              render={({field: {onChange, value}}) => (
                <InputField
                  label="About You"
                  value={value}
                  onChangeText={text => {
                    clearErrors('aboutYou');
                    onChange(text);
                  }}
                  error={errors.aboutYou?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="location"
              render={({field: {onChange, value}}) => (
                <InputField
                  label="Your Location"
                  value={value}
                  onChangeText={text => {
                    clearErrors('location');
                    onChange(text);
                  }}
                  error={errors.location?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="category"
              render={({field: {onChange, value}}) => (
                <View className="w-full">
                  <Text className="text-gray-700 text-md font-medium">
                    Your Category
                  </Text>
                  <MultiSelectDropdown
                    data={categoryList.map(tag => ({
                      label: tag,
                      value: tag,
                    }))}
                    searchPlaceholder="Your Category"
                    onSelectionChange={items => {
                      clearErrors('category');
                      onChange(items);
                    }}
                    maxHeight={250}
                    selectedOptions={value}
                    error={errors.category?.message}
                  />
                </View>
              )}
            />
            <View className="flex-col gap-2">
              <View className="flex-row items-center gap-2">
                <Icons.IgRoundedIcon width={24} height={24} />
                <Text className="text-gray-700 text-lg font-medium">
                  Instagram
                </Text>
              </View>
              {onBoarding?.instagramToken?.refreshToken ? (
                <View className="flex-row border border-gray-300 rounded-lg p-4 gap-3">
                  <Image
                    source={{
                      uri: getMediaURL(onBoarding?.profilePictureWithBg),
                    }}
                    className="w-14 h-14 rounded-full"
                  />
                  <View className="flex-col gap-1 flex-1">
                    <Text>@{onBoarding?.instagramDetails?.username}</Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-[#1946e7] text-md font-normal">
                        connected
                      </Text>
                      <Icons.VerifyIcon width={18} height={18} />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleDisconnect}
                    className="self-center">
                    <Text className="text-[#e74c3c] text-md font-medium">
                      Disconnect
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleConnect}
                  className="flex-row items-center gap-2 justify-center border border-gray-300 rounded-lg p-4">
                  <Icons.IgRoundedIcon width={24} height={24} />
                  <Text className="text-gray-700 text-lg font-medium">
                    Connect Your Instagram
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Button title={'Save'} onPress={handleSave} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={loading} />
    </View>
  );
};

export default BasicDetailsScreen;
