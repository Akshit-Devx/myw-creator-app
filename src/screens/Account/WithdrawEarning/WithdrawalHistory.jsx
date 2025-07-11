import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import {useSelector} from 'react-redux';
import {createWithdrawalRequest} from '../../../services/handleApi';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';
import {methods} from './payoutMethods';
import {convertToTitleCase, formatDate} from '../../../utility/helper';

const statusColor = {
  INITIATED: {
    color: '#CF8723',
    background: '#FFEBD0',
  },
  FAILED: {
    color: '#E35959',
    background: '#FFE6E6',
  },
  SUCCESS: {
    color: '#428F23',
    background: '#E4FFD9',
  },
};

const WithdrawalHistory = ({navigation}) => {
  const {referrals} = useSelector(state => state.referral);

  const renderItem = ({item}) => {
    const payoutMethod = referrals?.payoutMethods?.find(
      payout => payout.id === item.payoutMethodId,
    );

    const statusStyle = statusColor[item.status] || {
      color: '#000',
      background: '#EEE',
    };

    const IconComponent = Icons[payoutMethod?.methodName];

    return (
      <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
        {/* Left side - Icon + Status + Date */}
        <View className="flex-row items-center">
          {/* Image/Icon */}
          <IconComponent width={40} height={40} />

          {/* Status and Date */}
          <View className="ml-3">
            <Text
              className="text-xs font-semibold px-2 py-[2px] rounded"
              style={{
                backgroundColor: statusStyle.background,
                color: statusStyle.color,
              }}>
              {convertToTitleCase(item.status)}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        {/* Right side - Amount */}
        <Text className="text-base font-bold text-green-600">
          +₹{item.amount}
        </Text>
      </View>
    );
  };

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
        <Text className="text-[28px] font-semibold">Withdrawal History</Text>

        {!!referrals?.withdrawalHistroy?.length ? (
          <View>
            <FlatList
              data={referrals.withdrawalHistroy}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              className="bg-white rounded-xl px-4"
            />
          </View>
        ) : (
          <View className="bg-gray-100 rounded-xl p-4 flex-1 justify-center items-center">
            <Text className="text-gray-500">No histoy found</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WithdrawalHistory;
