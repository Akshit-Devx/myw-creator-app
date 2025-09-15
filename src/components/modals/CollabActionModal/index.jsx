import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

import {Icons} from '../../../assets/icons';
import {DateChangeRequestIcon, WithdrawIcon} from '../../../utility/icons';

const CollabActionModal = ({visible, handleClose, onWithdraw, onDateChange}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View className="flex-1 justify-end items-center bg-black/50 ">
        <View className="bg-white p-5 rounded-3xl w-full relative">
          <View className="flex-col gap-5 mb-5">
            <TouchableOpacity
              onPress={onWithdraw}
              className="flex-row items-center gap-2 w-full">
              <WithdrawIcon />
              <Text className="text-lg font-medium">Withdraw Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDateChange}
              className="flex-row items-center gap-2 w-full">
              <DateChangeRequestIcon />
              <Text className="text-lg font-medium">Date Change Request</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-5 right-5">
            <Icons.CrossIcon width={24} height={24} fill="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CollabActionModal;
