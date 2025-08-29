import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import {Icons} from '../../../../../assets/icons';
import {formatNumber} from '../../../../../utility/helper';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CampaignEligibility = memo(({data, campaignData}) => {
  const {type} = campaignData || {};
  const {minFollowers, maxFollowers} = data || {};
  const platform = data?.platform || 'INSTAGRAM';

  const [cardExpanded, setCardExpanded] = useState(true);

  const getFollowerRange = () => {
    if (minFollowers && maxFollowers) {
      return `${formatNumber(minFollowers)} - ${formatNumber(maxFollowers)}`;
    } else if (minFollowers) {
      return `${formatNumber(minFollowers)}+`;
    }
    return '';
  };

  const getPlatformInfo = () => {
    switch (platform) {
      case 'YOUTUBE':
        return {
          name: 'YouTube',
          icon: <Icons.YTIcon width={16} height={16} />,
          color: '#FF0000',
        };
      case 'INSTAGRAM':
        return {
          name: 'Instagram',
          icon: <Icons.IGIcon width={16} height={16} />,
          color: '#E4405F',
        };
      default:
        return {
          name: 'Instagram',
          icon: <Icons.IGIcon width={16} height={16} />,
          color: '#E4405F',
        };
    }
  };

  const platformInfo = getPlatformInfo();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="border border-gray-200 rounded-lg p-4 flex-col gap-3"
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setCardExpanded(!cardExpanded);
      }}>
      <View className="flex-row items-center gap-2 justify-between">
        <Text>Eligibility</Text>
        {cardExpanded ? (
          <Icons.ChevronUp width={26} height={26} />
        ) : (
          <Icons.ChevronDown width={26} height={26} />
        )}
      </View>
      {cardExpanded && (
        <View className="flex-col gap-5">
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="w-[40] h-[40] bg-[#F5E6D3] rounded-full items-center justify-center">
                <Icons.UsersIcon width={20} height={20} />
              </View>
              <View>
                <Text className="text-md text-[#333] font-medium">
                  Followers
                </Text>
                <Text className="text-md text-[#333] font-normal">
                  {getFollowerRange()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 flex-1">
              <View className="w-[40] h-[40] bg-[#e8f5e8] rounded-full items-center justify-center">
                <Icons.PlatformIcon width={20} height={20} />
              </View>
              <View className="flex-col">
                <Text className="text-md text-[#333] font-medium">
                  Platform
                </Text>
                <View className="flex-row items-center gap-1">
                  {platformInfo.icon}
                  <Text className="text-md text-[#333] font-normal">
                    {platformInfo.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="w-[40] h-[40] bg-[#F3E5F7] rounded-full items-center justify-center">
                <Icons.PlatformIcon width={14} height={14} />
              </View>
              <View>
                <Text className="text-md text-[#333] font-medium">Type</Text>
                <Text className="text-md text-[#333] font-normal">
                  {type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase()}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 flex-1">
              <View className="w-[40] h-[40] bg-[#FFE6E6] rounded-full items-center justify-center">
                <Icons.PlayIcon width={20} height={20} />
              </View>
              <View className="flex-col">
                <Text className="text-md text-[#333] font-medium">Content</Text>
                <Text className="text-md text-[#333] font-normal">Manual</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default CampaignEligibility;
