import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Icons} from '../../../../assets/icons';
import {formatNumber} from '../../../../utility/helper';

const insightData = [
  {
    key: 'average_likes',
    title: 'Average Likes',
    icon: Icons.LikeOutlineIcon,
    bg_color: '#f5e8ff',
    color: '#c084f8',
  },
  {
    key: 'average_views',
    title: 'Average Views',
    icon: Icons.EyeWhiteIcon,
    bg_color: '#fee3e5',
    color: '#fb567a',
  },
  {
    key: 'comments',
    title: 'Comments',
    icon: Icons.CommentWhiteIcon,
    bg_color: '#ddfce6',
    color: '#3cd755',
  },
  {
    key: 'engagement',
    title: 'Engagement',
    icon: Icons.EngagementIcon,
    bg_color: '#fef4de',
    color: '#ff9375',
  },
];

const SocialAnalyticsTab = ({onBoarding}) => {
  const {instagramDetails, instagramInsights} = onBoarding;

  const [instagramInsightData, setInstagramInsightData] = useState(insightData);

  useEffect(() => {
    setInstagramInsightData(
      insightData.map(item => {
        if (item.key === 'average_likes') {
          return {...item, value: instagramInsights?.avgLikes};
        }
        if (item.key === 'average_views') {
          return {...item, value: instagramInsights?.avgViews};
        }
        if (item.key === 'comments') {
          return {...item, value: instagramInsights?.avgComments};
        }
        if (item.key === 'engagement') {
          return {...item, value: instagramInsights?.engagementRate};
        }
      }),
    );
  }, [instagramInsights]);

  return (
    <View className="flex-1 flex-col gap-[20]">
      <View className="flex-row items-center gap-3 border border-black py-2 px-4 rounded-full self-start">
        <Icons.IGIcon width={20} height={20} />
        <Text className="text-md text-black font-medium">Instagram</Text>
      </View>
      <View className="flex-row items-center gap-3 py-3 px-4 border border-[#e2e5e9] rounded-lg">
        <Text className="text-md text-gray-900 font-semibold">
          @{instagramDetails?.username}
        </Text>
      </View>
      <View className="bg-[#efefff] px-5 py-4 rounded-xl flex-col gap-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-[#4573e3] p-2 rounded-full">
            <Icons.FollowerIcon width={20} height={20} fill={'#FFF'} />
          </View>
          <Text className="text-lg text-gray-700 font-semibold">Follower</Text>
        </View>
        <Text className="text-2xl text-gray-700 font-bold">
          {formatNumber(instagramInsights?.followersCount || 0)}
        </Text>
      </View>
      <View className="w-full flex-row flex-wrap justify-between">
        {instagramInsightData?.map(item => {
          return (
            <View
              className="rounded-xl px-3 py-5 flex-col gap-2 mt-4"
              style={[styles.itemContainer, {backgroundColor: item?.bg_color}]}>
              <View className="flex-row items-center gap-2">
                <View
                  className="p-2 rounded-full"
                  style={{backgroundColor: item?.color}}>
                  <item.icon width={20} height={20} fill={'#FFF'} />
                </View>
                <Text className="text-lg text-gray-700 font-semibold">
                  {item.title}
                </Text>
              </View>
              <Text className="text-2xl text-gray-900 font-semibold">
                {formatNumber(item?.value || 0)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SocialAnalyticsTab;

const styles = StyleSheet.create({
  itemContainer: {
    width: '48%',
  },
});
