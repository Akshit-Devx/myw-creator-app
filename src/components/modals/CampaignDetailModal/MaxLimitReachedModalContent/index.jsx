import {View, Text} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import Button from '../../../elements/Button';

const MaxLimitReachedModalContent = ({handleClose, title, content}) => {
  return (
    <View className="flex-col gap-4 justify-center items-center">
      <View className="w-[80] h-[80] bg-[#FFFFFF] rounded-full items-center justify-center mt-[-55]">
        <View className="w-[70] h-[70] bg-[#FAE5E2] rounded-full items-center justify-center">
          <Icons.AdsClick width={40} height={40} />
        </View>
      </View>
      <Text className="text-xl font-semibold text-gray-900">
        {title || 'Action Required'}
      </Text>
      <Text className="text-md text-center font-normal text-gray-600 px-4 tracking-wide">
        {content ||
          'You must complete the deliverables for your previous campaigns before applying for new ones.'}
      </Text>
      <Button title="Got It" onPress={handleClose} className="mt-4 w-full" />
    </View>
  );
};

export default MaxLimitReachedModalContent;
