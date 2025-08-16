import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import { Icons } from '../../../assets/icons';

const AutoDmModal = ({visible, onClose}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg w-4/5">
          <View className="flex items-center mb-4">
            <Icons.CircleCheckSolid width={80} height={80} />
          </View>
          <Text className="text-center text-neutral-800 text-xl mb-4 font-semibold">
            Auto DM Activated
          </Text>
          <Text className="text-center text-gray-500 text-sm mb-6 font-normal">
            Now you can track the sales you are getting from your reels?
          </Text>
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={onClose}>
            <Text className="text-white text-center text-sm font-medium">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AutoDmModal;
