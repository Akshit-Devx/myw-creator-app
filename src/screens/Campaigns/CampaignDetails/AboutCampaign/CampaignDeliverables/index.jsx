import React, {memo} from 'react';
import {View, Text} from 'react-native';

import {Icons} from '../../../../../assets/icons';
import Counter from '../../../../../components/common/Counter';

const CampaignDeliverables = memo(
  ({
    data,
    platform,
    isNegotiable,
    showTitle = false,
    wantToCounter = false,
    campaignNegotiationOffers = {},
    onNegotiationChange = () => {},
    type,
  }) => {
    const deliverablesData = [
      ...(platform.toLowerCase() === 'instagram'
        ? [
            {
              icon: <Icons.IgStory width={34} height={34} />,
              label: 'Instagram Stories',
              count: data?.deliverables?.stories,
              key: 'stories',
            },
          ]
        : []),
      ...(platform.toLowerCase() === 'instagram'
        ? [
            {
              icon: <Icons.IgPost width={34} height={34} />,
              label: 'Instagram Posts',
              count: data?.deliverables?.posts,
              key: 'posts',
            },
          ]
        : []),
      ...(platform.toLowerCase() === 'instagram'
        ? [
            {
              icon: <Icons.IgReel width={34} height={34} />,
              label: 'Instagram Reels',
              count: data?.deliverables?.reels,
              key: 'reels',
            },
          ]
        : []),
      ...(platform.toLowerCase() === 'youtube'
        ? [
            {
              icon: <Icons.YTIcon width={34} height={34} />,
              label: 'Youtube Videos',
              count: data?.deliverables?.videos,
              key: 'videos',
            },
          ]
        : []),
      ...(platform.toLowerCase() === 'youtube'
        ? [
            {
              icon: <Icons.ShortsIcon width={34} height={34} />,
              label: 'Youtube Shorts',
              count: data?.deliverables?.shorts,
              key: 'shorts',
            },
          ]
        : []),
      ...(type === 'RESORTS'
        ? [
            {
              icon: <Icons.UsersIcon width={34} height={34} />,
              label: 'Guests Allowed',
              count: data?.allowedGuests,
              key: 'allowedGuests',
            },
          ]
        : []),
    ].filter(({count, key}) => key === 'allowedGuests' || count);

    const renderCountOrCounter = item => {
      console.log('campaignNegotiationOffers[item.key]', campaignNegotiationOffers[item.key])
      if (
        wantToCounter &&
        isNegotiable &&
        campaignNegotiationOffers[item.key] !== undefined
      ) {
        return (
          <Counter
            initialValue={campaignNegotiationOffers[item.key]}
            onChange={value => onNegotiationChange(item.key, value)}
          />
        );
      }
      return (
        <Text className="bg-neutral-200 text-neutral-800 px-2 py-1 rounded-md text-lg font-medium">
          {item?.count}
        </Text>
      );
    };

    return (
      <View className="p-5 flex-col gap-5 border border-neutral-200 rounded-xl">
        {showTitle && (
          <View className="flex-col gap-2">
            <Text className="text-xl font-semibold">Deliverables</Text>
            <Text>Things you have to deliver post acceptance</Text>
          </View>
        )}
        {deliverablesData?.map(i => {
          return (
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-3">
                {i?.icon}
                <Text className="text-lg font-medium text-neutral-800">
                  {i?.label}
                </Text>
              </View>
              {renderCountOrCounter(i)}
            </View>
          );
        })}

        {isNegotiable && (
          <View className="flex-row items-center gap-2">
            <Icons.AwardStarIcon width={26} height={26} />
            <Text className="text-lg font-medium text-neutral-800">
              These deliverables is negotiable
            </Text>
          </View>
        )}
      </View>
    );
  },
);

export default CampaignDeliverables;
