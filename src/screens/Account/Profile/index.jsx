import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Button from '../../../components/elements/Button';

const ProfileScreen = () => {
  const {onBoarding} = useSelector(state => state?.onBoarding);
  return (
    <View className="flex-1 bg-white p-5">
      <View className="border border-gray-200 rounded-xl">
        <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
          <View className="flex-col gap-1">
            <Text>Full Name</Text>
            <Text className="text-lg font-semibold">{onBoarding?.name}</Text>
          </View>
          <Button title="Edit" variant="ghost" size="sm" className="w-12" />
        </View>
        <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
          <View className="flex-col gap-1">
            <Text>Mobile</Text>
            <Text className="text-lg font-semibold">{onBoarding?.phone}</Text>
          </View>
          <Button title="Edit" variant="ghost" size="sm" className="w-12" />
        </View>
        <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
          <View className="flex-col gap-1">
            <Text>Username</Text>
            <Text className="text-lg font-semibold">{onBoarding?.slug}</Text>
          </View>
          <Button title="Edit" variant="ghost" size="sm" className="w-12" />
        </View>
        <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
          <View className="flex-col gap-1">
            <Text>Instagram Username</Text>
            <Text className="text-lg font-semibold">
              @{onBoarding?.instagramDetails?.username}
            </Text>
          </View>
          {onBoarding?.instagramToken?.refreshToken ? (
            <Text className="text-green-700 font-medium bg-green-50 p-2 rounded-md border border-green-700">
              Connected
            </Text>
          ) : (
            <Button title="Edit" variant="ghost" size="sm" className="w-12" />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
