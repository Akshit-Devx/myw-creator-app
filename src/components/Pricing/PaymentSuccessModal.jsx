import React from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');

const PaymentSuccessModal = ({isOpen, onClose}) => {
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.iconContainer}>
          <FastImage
            source={require('../../assets/images/gif/paymentsuccess.gif')}
            style={{width: 150, height: 150}}
          />
        </View>

        <Text style={styles.modalTitle}>Payment Successful! 🎉</Text>

        <Text style={styles.modalMessage}>
          You're now subscribed and ready to go. You can now explore and apply
          to all Collabs & Offers on Mywall!
        </Text>

        <View style={styles.gotItButtonSection}>
          <TouchableOpacity onPress={onClose} style={styles.gotItButton}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentSuccessModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width * 0.85,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  confettiAnimation: {
    width: 120,
    height: 120,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  gotItButtonSection: {
    width: '100%',
    alignItems: 'center',
  },
  gotItButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
