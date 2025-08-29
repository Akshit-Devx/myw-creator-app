import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Linking,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../../../assets/icons';
import AvailabilityDropdown from '../AvailabilityDropdown';
import {convertTo12HourFormat} from '../../../../../utility/helper';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const CampaignAvailability = memo(({type, campaignData, selectedStore}) => {
  const [cardExpanded, setCardExpanded] = useState(true);
  if (type === 'PRODUCTS') {
    return null;
  }

  const handleGetDirections = () => {
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${selectedStore?.address}`,
    );
  };

  console.log('selectedStore?.availability ', selectedStore?.availability);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setCardExpanded(!cardExpanded);
      }}
      className="border border-gray-200 rounded-lg p-4 flex-col gap-3">
      <View className="flex-row items-center gap-2 justify-between">
        <Text className="text-lg font-medium text-neutral-800">
          Availability
        </Text>
        {cardExpanded ? (
          <Icons.ChevronUp width={26} height={26} />
        ) : (
          <Icons.ChevronDown width={26} height={26} />
        )}
      </View>
      {cardExpanded && (
        <View className="flex-col gap-3">
          {selectedStore?.availability?.length && (
            <View className="flex-col gap-3">
              <View className="flex-row items-center gap-2">
                <LinearGradient
                  colors={['#4d32fc', '#9747ff']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    width: 28,
                    height: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                  }}>
                  <Icons.CalendarIcon width={16} height={16} />
                </LinearGradient>
                <Text className="text-md text-neutral-800 font-normal">
                  {type === 'RESORTS' ? 'Timings' : 'Opening Hours'}
                </Text>
              </View>
              {type !== 'RESORTS' && (
                <AvailabilityDropdown
                  availability={selectedStore?.availability}
                />
              )}
              {type === 'RESORTS' && (
                <View className="flex-row items-center gap-2">
                  <Text className="text-md text-neutral-800 font-semibold">
                    Check In:
                    <Text className="text-md text-neutral-800 font-normal">
                      {campaignData?.storesData?.[0]?.availability?.[0]
                        ?.openTime &&
                        convertTo12HourFormat(
                          campaignData?.storesData?.[0]?.availability?.[0]
                            ?.openTime || '-',
                        )}{' '}
                    </Text>
                  </Text>
                  -
                  <Text className="text-md text-neutral-800 font-semibold">
                    Check Out:
                    <Text className="text-md text-neutral-800 font-normal">
                      {campaignData?.storesData?.[0]?.availability?.[0]
                        ?.closeTime &&
                        convertTo12HourFormat(
                          campaignData?.storesData?.[0]?.availability?.[0]
                            ?.closeTime || '-',
                        )}{' '}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          )}
          <View className="flex-col gap-3">
            <View className="flex-row items-center gap-2">
              <LinearGradient
                colors={['#4d32fc', '#9747ff']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  width: 28,
                  height: 28,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <Icons.DistanceIcon width={16} height={16} />
              </LinearGradient>
              <Text className="text-md text-neutral-800 font-normal">
                Location
              </Text>
            </View>
            <Text className="text-md text-neutral-800 font-semibold">
              {selectedStore?.address}, {selectedStore?.city},{' '}
              {selectedStore?.state}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGetDirections}
              className="flex-row items-center gap-2 border border-[#1946E7] px-4 py-2 rounded-lg self-start">
              <Text className="text-md text-[#1946E7] font-medium">
                Get Directions
              </Text>
              <Icons.ArrowTopRight width={18} height={18} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

export default CampaignAvailability;
