import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../components/elements/Button';
import {signOut} from 'aws-amplify/auth';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {resetStore} from '../../store/store';
import {getInfluencerMediaURL} from '../../utility/helper';
import {Icons} from '../../assets/icons';
import HeaderBackButton from '../../components/common/HeaderBackButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);

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

  const shadowBoxStyle = {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f8f8f8]">
      <View className="flex-row justify-between items-center p-5">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Main', {screen: 'Explore'});
          }}
          className="p-2 border border-black rounded-xl">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Detail', {screen: 'Invites'})}
          className="p-1 border border-gray-200 rounded-full">
          <Icons.InvitesIcon height={36} width={36} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-[#f8f8f8] p-5 flex-col gap-10">
        <View className="flex-col items-center gap-2">
          <Image
            source={{
              uri: getInfluencerMediaURL(onBoarding?.profilePictureWithBg),
            }}
            className="w-32 h-32 rounded-full"
          />
          <Button title="Edit Profile Picture" variant="ghost" size="sm" />
          <Text className="text-2xl font-semibold">{onBoarding?.name}</Text>
          <Text className="text-base text-gray-500">
            @{onBoarding?.instagramDetails?.username}
          </Text>
        </View>
        <View className="rounded-xl shadow-2xl bg-white" style={shadowBoxStyle}>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={() =>
              navigation.navigate('Detail', {
                screen: 'Profile',
              })
            }>
            <Icons.ProfileAccount />
            <Text className="text-xl border-gray-200 p-4">
              Profile Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={() =>
              navigation.navigate('Detail', {
                screen: 'Subscriptions',
              })
            }>
            <Icons.Subscription />
            <Text className="text-xl border-gray-200 p-4">Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={() =>
              navigation.navigate('Detail', {
                screen: 'MywallReferrral',
              })
            }>
            <Icons.Referral />
            <Text className="text-xl border-gray-200 p-4">Mywall Referral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={() =>
              navigation.navigate('Detail', {
                screen: 'AutoDM',
              })
            }>
            <Icons.AutoDM />
            <Text className="text-xl border-gray-200 p-4">
              Instagram Auto DM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={() =>
              navigation.navigate('Detail', {
                screen: 'Addresses',
              })
            }>
            <Icons.AutoDM />
            <Text className="text-xl border-gray-200 p-4">Addresses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center border-gray-200 px-4"
            onPress={handleLogout}>
            <Icons.Logout />
            <Text className="text-xl text-red-500 p-4">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
