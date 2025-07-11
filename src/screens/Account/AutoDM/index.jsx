import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_LOGIN_SCOPES,
  WEBSITE_URL,
} from '@/config/envConfig';

import {Icons} from '../../../assets/icons';
import TopNav from '../../../components/layouts/TopNav';

const AutoDMScreen = ({navigation}) => {
  const handleInstagramLogin = () => {
    // localStorage.setItem(
    //   'redirectURL',
    //   '/configure/account/activate-auto-dm/choose-reel',
    // );
    // window.location.href = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${WEBSITE_URL}/configure/instagram/&response_type=code&scope=${INSTAGRAM_LOGIN_SCOPES}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8] px-5 pt-2">
      <TopNav />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="mt-2 mb-4">
        <Text className="text-[#1677ff] text-[14px] ">{'< Back'}</Text>
      </TouchableOpacity>
      <View className="flex-1 items-center">
        <Text className="text-[26px] font-bold text-black mb-4 text-center">
          Automatically respond to{'\n'}every message on IG
        </Text>

        <View className="w-full rounded-xl overflow-hidden bg-white mb-6">
          {/* <Image
          source={require('../../../assets/images/auto_dm_preview.png')} // Use your image here
          className="w-full h-[180px] rounded-xl"
          resizeMode="cover"
        /> */}
          <Icons.DmFrame height={180} />
        </View>
        <TouchableOpacity
          className="w-full border border-[#ccc] rounded-xl py-3 flex-row items-center justify-center mb-4 bg-white"
          onPress={handleInstagramLogin}>
          <Icons.IgRoundedIcon width={20} height={20} />
          <Text className="text-[16px] font-medium ml-2">
            Connect Your Instagram
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full border border-[#1677ff] rounded-xl py-3 items-center justify-center"
          onPress={() => navigation.navigate('AutoDMDashboard')}>
          <Text className="text-[#1677ff] text-[16px] font-semibold">
            Auto DM Insights
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AutoDMScreen;
