import {View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {PNGs} from '../../../assets/png';
import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';

const ConnectIGModal = ({visible, handleClose, handleConnectToInstagram}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View
        onPress={handleClose}
        className="flex-1 justify-center items-center bg-black/50 px-8">
        <View className="bg-white rounded-3xl overflow-hidden relative">
          <View className="flex-col gap-4">
            <LinearGradient
              colors={['#fff6f6', '#fcf2ff', '#fff8e4']}
              locations={[0.0116, 0.5224, 0.9846]}
              start={{x: 0.95, y: 0.05}}
              end={{x: 0.05, y: 0.95}}
              style={{width: '100%', height: 200, justifyContent: 'center'}}>
              <View className="p-[40px] flex-row items-center justify-between">
                <Image source={PNGs.IGLogoIcon} className="w-[50] h-[50]" />
                <View className="w-[30] h-[30] bg-[#EE4B5F] rounded-full items-center justify-center ml-[20]">
                  <Icons.LinkIcon />
                </View>
                <View className="w-[68] h-[68]">
                  <Icons.MywallLogo width={'100%'} height={'100%'} />
                </View>
              </View>
            </LinearGradient>
            <View className="flex-col gap-3 p-5 justify-center items-center">
              <Text className="text-xl font-semibold text-gray-900">
                Connect your instagram
              </Text>
              <Text className="text-md text-center font-normal text-gray-600 px-4 tracking-wide">
                Connect your Instagram account with MyWall to check eligibility
                for campaigns
              </Text>
              <View className="w-full">
                <Button
                  title="Connect to Instagram"
                  onPress={handleConnectToInstagram}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} className="absolute top-5 right-5">
            <Icons.CrossIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConnectIGModal;
