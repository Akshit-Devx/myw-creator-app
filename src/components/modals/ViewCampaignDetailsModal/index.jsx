import React from 'react';
import {View, Text, Modal} from 'react-native';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';

const DELIVERABLE_MAPPINGS = {
  reels: {label: 'Reels', icon: <Icons.IgReel width={40} height={40} />},
  posts: {label: 'Posts', icon: <Icons.IgPost width={40} height={40} />},
  stories: {label: 'Stories', icon: <Icons.IgStory width={40} height={40} />},
  shorts: {label: 'Shorts', icon: <Icons.ShortsIcon width={20} height={20} />},
  allowedGuests: {label: 'Allowed Guests', icon: <Icons.GuestsIcon width={40} height={40} />},
};

const ViewCampaignDetailsModal = ({visible, onClose, type, details}) => {
  const deliverableItems = Object.entries(details)
    .filter(
      ([key, value]) =>
        DELIVERABLE_MAPPINGS[key] &&
        typeof value === 'number' &&
        value !== null,
    )
    .map(([key, value]) => ({
      icon: DELIVERABLE_MAPPINGS[key].icon,
      label: DELIVERABLE_MAPPINGS[key].label,
      count: value,
    }));
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 p-5 w-full">
        <View className="bg-white p-2 rounded-lg w-full p-8 flex-col gap-6">
          <View className="flex-col gap-4">
            {deliverableItems.map((item, index) => (
              <View key={index} className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-[#fbe5e2] rounded-full items-center justify-center">
                  {item.icon}
                </View>
                <View className="flex-row justify-between items-center flex-1">
                  <Text className="text-lg text-[#333] font-medium">{item.label}</Text>
                  <Text className="text-md text-[#333] font-semibold bg-[#e2e5e9] px-2 py-1 rounded-lg">{item.count}</Text>
                </View>
              </View>
            ))}
          </View>
          <Button title="Okay" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ViewCampaignDetailsModal;
