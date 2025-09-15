import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {twMerge} from 'tailwind-merge';

const AddressCard = ({
  address,
  isSelected,
  hideRadio = false,
  onSelect,
  userName,
  userPhone,
}) => {
  const addressText =
    typeof address === 'string'
      ? address
      : `${address?.addressLine1 || ''}, ${address?.addressLine2 || ''}, ${
          address?.city || ''
        }, ${address?.state || ''}, ${address?.pincode || ''}, ${
          address?.country || ''
        }`;

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={twMerge(
        `border-2 bg-white px-[18] py-[20] rounded-2xl flex-row items-start gap-2 ${
          isSelected ? 'border-[#1946e7]' : 'border-[#e1e7ff]'
        }`,
      )}>
      {!hideRadio && (
        <View
          className={twMerge(
            `w-6 h-6 justify-center items-center border-2 rounded-full ${
              isSelected ? 'border-[#1946e7]' : 'border-[#bdbdbd]'
            }`,
          )}>
          {isSelected && <View className="w-3 h-3 rounded-full bg-[#1946e7]" />}
        </View>
      )}
      <View className="flex-col gap-1">
        <Text className="text-lg font-medium text-[#333] mb-2">{userName}</Text>
        <Text className="text-md font-normal text-[#333]">{addressText}</Text>
        <Text className="text-md font-normal text-[#333]">{`Phone number: ${userPhone}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddressCard;
