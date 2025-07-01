import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Icons} from '../../../assets/icons';

const ReferralDashboard = ({navigation}) => {
  const handlePress = () => navigation.goBack();

  return (
    <View className="flex-1 bg-white p-5">
      <TouchableOpacity
        onPress={handlePress}
        className="p-2 border border-black rounded-xl self-start mb-6">
        <Icons.BackIcon width={20} height={20} />
      </TouchableOpacity>
      <Text className="text-[28px] font-semibold">Referral Dashboard</Text>
      <View className="bg-[#0D0C2D] rounded-2xl p-4 mb-6">
        <Text className="text-white text-base mb-2">Withdrawable Earnings</Text>
        <Text className="text-white text-3xl font-bold mb-4">₹ 0</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-[#4D4C69] px-4 py-3 rounded-lg flex-1"
            onPress={() => navigation.navigate('WithdrawEarning')}>
            {/* <Icon name="arrow-down-circle" size={18} color="white" /> */}
            <Text className="text-white font-semibold ml-2">Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-[#4D4C69] px-4 py-3 rounded-lg flex-1 items-center">
            <Text className="text-white font-semibold">History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview */}
      <Text className="text-xl font-semibold text-black mb-3">Overview</Text>
      <View className=" border border-gray-300 rounded-xl p-3">
        <Text className="text-black text-sm">💰 Earnings</Text>
        <Text className="text-black font-semibold mt-1">₹ 0</Text>
      </View>

      <View className="flex-row justify-between my-4">
        <View className="flex-row flex-1">
          <View className="flex-1 border border-gray-300 rounded-xl p-3 ">
            <Text className="text-black text-sm">👥 Referred Users</Text>
            <Text className="text-black font-semibold mt-1">0</Text>
          </View>
          <View className="flex-1 border border-gray-300 rounded-xl p-3 ml-4">
            <Text className="text-black text-sm">🕒 Sign Ups</Text>
            <Text className="text-black font-semibold mt-1">0</Text>
          </View>
        </View>
      </View>
      {/* </View> */}

      {/* Referred Users Table Header */}
      <Text className="text-xl font-semibold text-black mb-2">
        Referred users
      </Text>

      <View className="flex-row justify-between bg-gray-100 px-3 py-2 rounded-md">
        <Text className="text-gray-700 font-semibold">Users</Text>
        <Text className="text-gray-700 font-semibold">Earnings</Text>
      </View>
    </View>
  );
};

export default ReferralDashboard;

const styles = StyleSheet.create({});
