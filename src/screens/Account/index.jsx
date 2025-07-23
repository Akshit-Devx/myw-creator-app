import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../components/elements/Button';
import {signOut} from 'aws-amplify/auth';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {resetStore} from '../../store/store';
import {getMediaURL} from '../../utility/helper';
import {fetchInfluencerById} from '../../store/slices/onBoarding';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);

  useEffect(() => {
    dispatch(fetchInfluencerById(onBoarding?.id));
  }, [dispatch, onBoarding?.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(resetStore());
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth', params: {screen: 'Login'}}],
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-5 flex-col gap-10">
      <View className="flex-col items-center gap-2">
        <Image
          source={{
            uri: getMediaURL(onBoarding?.profilePictureWithBg),
          }}
          className="w-32 h-32 rounded-full"
        />
        <Button title="Edit Profile Picture" variant="ghost" size="sm" />
        <Text className="text-2xl font-semibold">{onBoarding?.name}</Text>
        <Text className="text-base text-gray-500">
          @{onBoarding?.instagramDetails?.username}
        </Text>
        {onBoarding?.instagramToken?.refreshToken && (
          <Text className="text-base text-blue-600 border border-blue-600 py-1 px-2 rounded-md">
            Connected
          </Text>
        )}
      </View>
      <View className="border border-gray-200 rounded-xl">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'Profile',
            })
          }>
          <Text className="text-xl border-b border-gray-200 p-4">
            Profile Settings
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'Subscriptions',
            })
          }>
          <Text className="text-xl border-b border-gray-200 p-4">
            Subscriptions
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'Referrral',
            })
          }>
          <Text className="text-xl border-b border-gray-200 p-4">
            Mywall Referral
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'AutoDM',
            })
          }>
          <Text className="text-xl border-b border-gray-200 p-4">
            Instagram Auto DM
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Detail', {
              screen: 'Addresses',
            })
          }>
          <Text className="text-xl border-b border-gray-200 p-4">
            Addresses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-xl text-red-500 p-4">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountScreen;
