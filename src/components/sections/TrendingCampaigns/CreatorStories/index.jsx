import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import Video from 'react-native-video';
import {getMediaURL} from '../../../../utility/helper';

export const creatorStories = [
  {
    id: 1,
    videoSrc: 'public/homepage/w-goa.mp4',
  },
  {
    id: 2,
    videoSrc: 'public/homepage/looks-salon.mp4',
  },
  {
    id: 3,
    videoSrc: 'public/homepage/stay-elivas.mp4',
  },
  {
    id: 4,
    videoSrc: 'public/homepage/mhk.mp4',
  },
  {
    id: 5,
    videoSrc: 'public/homepage/opulence-luxury-salon.mp4',
  },
  {
    id: 6,
    videoSrc: 'public/homepage/novotel-goa-panjim.mp4',
  },
  {
    id: 7,
    videoSrc: 'public/homepage/hairmastersouthpoint.mp4',
  },
  {
    id: 8,
    videoSrc: 'public/homepage/crescenetgoa.mp4',
  },
  {
    id: 9,
    videoSrc: 'public/homepage/cutandstylepalam.mp4',
  },
  {
    id: 10,
    videoSrc: 'public/homepage/elivaasopalys.mp4',
  },
  {
    id: 11,
    videoSrc: 'public/homepage/leelacottage.mp4',
  },
];

const creatorCard = creator => {
  return (
    <View className="rounded-lg overflow-hidden">
      <Video
        source={{uri: getMediaURL(creator.videoSrc)}}
        style={{width: 130, height: 220}}
        resizeMode="cover"
        repeat
        muted
        paused={false}
        controls={false}
        playInBackground={false}
        playWhenInactive={false}
      />
    </View>
  );
};
const CreatorStoriesSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          TOP CREATOR STORIES
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={creatorStories}
        keyExtractor={(item, index) => item?.id + index}
        renderItem={({item: campaign}) => creatorCard(campaign)}
      />
    </View>
  );
};

export default CreatorStoriesSection;
