import {View, Modal, TouchableOpacity} from 'react-native';
import React from 'react';

const CampaignDetailModal = ({visible, onClose, children}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/50 p-8">
        <View className="bg-white p-5 rounded-lg w-full">{children}</View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CampaignDetailModal;
