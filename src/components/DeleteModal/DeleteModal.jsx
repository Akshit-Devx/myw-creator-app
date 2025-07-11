import React from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import Button from '../elements/Button';

const DeleteModal = ({visible, text, closeModal, deleteConfirmation}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => closeModal(false)}>
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white w-11/12 rounded-2xl p-6">
          {/* Header */}
          <View className="flex-row items-center mb-4">
            {/* <ExclamationCircleIcon size={24} color="#DC2626" className="mr-2" /> */}
            <Text className="text-lg font-bold text-black">
              Delete Confirmation
            </Text>
          </View>

          {/* Content */}
          <Text className="text-base text-gray-700 mb-6">
            Are you sure you want to delete this {text}? This action cannot be
            undone.
          </Text>

          {/* Actions */}
          <View className="flex-row  gap-4">
            <Button
              onPress={() => closeModal(false)}
              title={'No, Cancel'}
              variant="secondary"
              textClassName="text-gray-700"
              className="px-4 py-2 flex-{0.5} rounded-md border border-gray-300"
            />

            <Button
              onPress={() => {
                deleteConfirmation();
                closeModal(false);
              }}
              className="px-4 py-2 flex-{0.5} rounded-md bg-red-600"
              title={'Yes, Delete'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
