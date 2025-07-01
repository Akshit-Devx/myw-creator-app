import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Icons} from '../../../assets/icons';
import Button from '../../../components/elements/Button';

const WithdrawEarning = ({navigation}) => {
  const [amount, setAmount] = useState('');
  const handlePress = () => navigation.goBack();

  return (
    <View className="flex-1 bg-white p-5">
      <TouchableOpacity
        onPress={handlePress}
        className="p-2 border border-black rounded-xl self-start mb-6">
        <Icons.BackIcon width={20} height={20} />
      </TouchableOpacity>
      <Text className="text-[28px] font-semibold">Withdraw Earnings</Text>
      <Text className="text-lg font-medium text-center text-black mb-2 mt-10">
        Available Balance: ₹ 0
      </Text>

      {/* Input for amount */}
      <TextInput
        className="text-4xl font-bold text-center text-black mt-8"
        placeholder="₹0"
        placeholderTextColor="#000"
        keyboardType="numeric"
        onChangeText={text => {
          const numeric = text.replace(/[^\d]/g, ''); // keep only digits
          setAmount(numeric ? `₹${numeric}` : '');
        }}
        value={amount}
        maxLength={6}
      />
      {/* Divider */}
      <View className="border-t border-gray-200 my-2" />

      {/* Minimum Note */}
      <Text className="text-center text-gray-500 mb-6">
        Minimum amount must be ₹100
      </Text>

      {/* Payout Method */}
      <Text className="text-base font-semibold text-black mb-2">
        Payout Method
      </Text>

      <View className="bg-gray-100 rounded-xl p-4">
        <Text className="text-gray-500">No payout methods added.</Text>
      </View>
      <Button
        title={'Add New'}
        variant="secondary"
        onPress={() => {}}
        className="rounded-xl border-gray-200 h-12 mt-6"
        textClassName="text-blue-600 text-lg"
      />

      <Button
        title={'Request Withdrawal'}
        variant="primary"
        onPress={() => {}}
        className="rounded-xl border-gray-200 h-12 mt-6"
        textClassName="text-blue-600 text-lg"
      />
      <Button
        title={'View Recent Withdrawals'}
        variant="secondary"
        onPress={() => {}}
        className="rounded-xl border-gray-300 h-12 mt-6"
        textClassName="text-lg font-normal text-gray-900"
      />
    </View>
  );
};

export default WithdrawEarning;

const styles = StyleSheet.create({});
