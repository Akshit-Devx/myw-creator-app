import React from 'react';
import {Alert, Clipboard, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {WEBSITE_URL} from '../../../../config/envConfig';
import Button from '../../../../components/elements/Button';

const ReferrralScreen = () => {
  const {onBoarding} = useSelector(state => state?.onBoarding);

  return (
    <View className="flex-1 flex-col gap-10 bg-white p-5">
      <View className="flex-col items-center gap-2">
        <Text className="text-xl font-medium">Mywall Referral Program</Text>
        <Text className="text-3xl font-bold">💰 Refer & Earn 💰</Text>
        <Text className="text-base text-center">
          Earn ₹50/month per active referral. You can earn up-to ₹50,000/Month
        </Text>
      </View>
      <View className="flex-col gap-2">
        <Text className="text-center text-lg">
          Invite via your referral code
        </Text>
        <View className="flex-row items-center justify-between border border-dashed border-gray-200 p-3 rounded-md bg-gray-100">
          <View className="flex-col gap-1">
            <Text>www.mywall.me/</Text>
            <Text className="text-xl font-bold">
              {onBoarding?.referralCode}
            </Text>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(
                  `${WEBSITE_URL}/${onBoarding?.referralCode || ''}`,
                );
                Alert.alert('Copied!', 'Referral code copied to clipboard');
              }}>
              <Text className="text-blue-600">Copy</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {}}>
              <Text className="text-blue-600">Share</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
      <Button
        variant="secondary"
        title="Go to Referral Dashboard"
        onPress={() => {}}
        className="w-full border border-blue-600"
        textClassName="text-blue-600"
      />
    </View>
  );
};

export default ReferrralScreen;
