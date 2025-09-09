import React from 'react';
import {View, Text} from 'react-native';

import { AutoDMSVG } from '../../../utility/icons';

const AutoDMCampaignCard = () => {
  return (
    <View className="bg-[#f8f9fa] border border-[#1946e7] rounded-lg p-3 my-4 p-4 my-3">
      <View className="mb-4">
        <Text
          className="text-[#1946e7] font-semibold text-[16px]">
          Important Requirement:
        </Text>
      </View>

      <View className="flex flex-col gap-1.5">
        <View className="flex flex-row items-center gap-3">
          <View className="flex items-center justify-center flex-shrink-0">
            <AutoDMSVG />
          </View>
          <Text className="text-black font-bold text-[16px] leading-tight">
            Auto DM Campaign + Sales Tracking
          </Text>
        </View>

        <Text className="text-[#666] font-normal text-[14px] leading-normal">
          After posting, you'll generate tracking links for sales. Your
          followers can DM you for product details and purchase directly through
          your tracking links.
        </Text>
      </View>
    </View>
  );
};

export default AutoDMCampaignCard;
