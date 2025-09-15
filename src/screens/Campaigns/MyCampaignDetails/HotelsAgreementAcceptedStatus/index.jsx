import React, {memo} from 'react';
import {View, Text} from 'react-native';

import {Icons} from '../../../../assets/icons';

const HotelsAgreementAcceptedStatus = () => {
  return (
    <View className="flex-col gap-2 items-center">
      <Icons.AcceptedIcon width={24} height={24} />
      <Text className="text-lg font-medium">Request Accepted</Text>
      <Text className="text-md text-[#535862] font-medium text-center">
        Our team will confirm the booking and call you for final confirmation
      </Text>
    </View>
  );
};

export default memo(HotelsAgreementAcceptedStatus);
