import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import {GIFs} from '../../../assets/gif';

const PaymentSuccessModal = ({visible, onClose, handleDone}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 p-5 w-full">
        <View className="bg-white p-2 rounded-lg w-full p-8">
          <View className="flex flex-col items-center">
            <FastImage
              source={GIFs.PaymentSuccess}
              resizeMode="contain"
              style={styles.gif}
            />

            <Text className="text-center text-2xl font-bold mb-4">
              Payment Successful! 🎉
            </Text>
            <Text className="text-center text-md text-gray-700 mb-6">
              You're now subscribed and ready to go. You can now explore and
              apply to all Collabs & Offers on Mywall!
            </Text>
            <View className="w-full">
              <TouchableOpacity
                className="h-[44] rounded-xl"
                onPress={handleDone}>
                <LinearGradient
                  colors={['#4d32fc', '#9747ff']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradient}>
                  <Text className="text-white text-xl font-semibold">Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentSuccessModal;

const styles = StyleSheet.create({
  gradient: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    shadowColor: '#4d32fc',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
    height: 44,
  },
  gif: {width: 100, height: 100},
});
