import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Button from '../../../components/elements/Button';
import {useNavigation} from '@react-navigation/native';
import HeaderBackButton from '../../../components/common/HeaderBackButton';
import {Icons} from '../../../assets/icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);

  const handlePress = () => navigation.goBack();

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <View className="flex-1 bg-white p-5">
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 border border-black rounded-xl self-start mb-6">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-[28px] font-semibold">Personal Details</Text>
        <View className="border border-gray-200 rounded-xl mt-5">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <View className="flex-col gap-1">
              <Text>Full Name</Text>
              <Text className="text-lg font-semibold">{onBoarding?.name}</Text>
            </View>
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              className="border border-gray-200 rounded-lg w-16"
              onPress={() =>
                navigation.navigate('EditPersonalDetails', {type: 'name'})
              }
            />
          </View>
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <View className="flex-col gap-1">
              <Text>Email</Text>
              {onBoarding?.email && (
                <Text className="text-lg font-semibold">
                  {onBoarding?.email}
                </Text>
              )}
            </View>
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              className="border border-gray-200 rounded-lg w-16"
              onPress={() =>
                navigation.navigate('EditPersonalDetails', {type: 'email'})
              }
            />
          </View>
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <View className="flex-col gap-1">
              <Text>Mobile</Text>
              <Text className="text-lg font-semibold">{onBoarding?.phone}</Text>
            </View>
            {/* <Button title="Edit" variant="ghost" size="sm" className="w-12" /> */}
          </View>
        </View>
        <View className="border border-gray-200 rounded-xl mt-5">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <View className="flex-col gap-1">
              <Text>Username</Text>
              <Text className="text-lg font-semibold">{onBoarding?.slug}</Text>
            </View>
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              className="border border-gray-200 rounded-lg w-16"
              onPress={() =>
                navigation.navigate('EditPersonalDetails', {
                  type: 'username',
                })
              }
            />
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
              <Button
                title="Edit"
                variant="ghost"
                size="sm"
                className="border border-gray-200 rounded-lg w-16"
                onPress={() =>
                  navigation.navigate('EditPersonalDetails', {
                    type: 'instagram-username',
                  })
                }
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
