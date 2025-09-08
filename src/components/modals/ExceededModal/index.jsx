import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

import {Icons} from '../../../assets/icons';

const ExceededModal = ({visible, onClose}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 p-5">
        <View className="bg-white p-2 rounded-xl p-8 flex-col gap-3 relative items-center">
          <Icons.AlertIcon width={46} height={46} />
          <Text className="text-lg font-medium text-center">
            You have exceeded the given offer amount!
          </Text>
          <TouchableOpacity
            className="absolute top-3 right-3"
            onPress={onClose}>
            <Icons.CrossIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ExceededModal;
