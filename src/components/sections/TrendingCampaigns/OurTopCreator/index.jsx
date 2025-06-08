import {
  View,
  Text,
  FlatList,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import {getBrandMediaURL} from '../../../../utility/helper';

export const influencerList = [
  {
    id: 1,
    avatar: 'public/static-assets/kishushroff.webp',
    username: 'kishushroff',
    followers: '1.4M+',
    instagramUrl: 'https://www.instagram.com/kishushroff',
  },
  {
    id: 2,
    avatar: 'public/static-assets/kritikadagar.webp',
    username: 'kritikadagar21',
    followers: '1.9M+',
    instagramUrl: 'https://www.instagram.com/kritikadagar21',
  },
  {
    id: 3,
    avatar: 'public/static-assets/mukulsharma.webp',
    username: 'iammukulsharmaa',
    followers: '1.3M+',
    instagramUrl: 'https://www.instagram.com/iammukulsharmaa',
  },
  {
    id: 4,
    avatar: 'public/static-assets/allen.webp',
    username: 'allen_choudhary',
    followers: '1.4M+',
    instagramUrl: 'https://www.instagram.com/allen_choudhary',
  },
  {
    id: 5,
    avatar: 'public/static-assets/rajvee-gandhi.webp',
    username: 'rxjvee',
    followers: '1.2M+',
    instagramUrl: 'https://www.instagram.com/rxjvee',
  },
  {
    id: 6,
    avatar: 'public/static-assets/ryan.webp',
    username: 'official_ryan_09',
    followers: '1M+',
    instagramUrl: 'https://www.instagram.com/official_ryan_09',
  },
  {
    id: 7,
    avatar: 'public/static-assets/kaul-me.webp',
    username: 'kaul_me',
    followers: '798K+',
    instagramUrl: 'https://www.instagram.com/kaul_me',
  },
  {
    id: 8,
    avatar: 'public/static-assets/suramyapandiya.webp',
    username: 'suramyapandiya',
    followers: '600K+',
    instagramUrl: 'https://www.instagram.com/suramyapandiya',
  },
  {
    id: 9,
    avatar: 'public/static-assets/mhk.webp',
    username: '__.mhk__',
    followers: '550K+',
    instagramUrl: 'https://www.instagram.com/__.mhk__',
  },
  {
    id: 10,
    avatar: 'public/static-assets/appy.webp',
    username: 'appy__77',
    followers: '385K+',
    instagramUrl: 'https://www.instagram.com/appy__77',
  },
  {
    id: 11,
    avatar: 'public/static-assets/mandeepgujjar.webp',
    username: 'mandeepgujjar_',
    followers: '268K+',
    instagramUrl: 'https://www.instagram.com/mandeepgujjar_',
  },
];

const creatorCard = creator => {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(creator?.instagramUrl)}
      className="flex-col items-center gap-1 p-4 border border-gray-200 rounded-xl">
      <Image
        source={{uri: getBrandMediaURL(creator.avatar)}}
        className="w-20 h-20 rounded-full"
      />
      <Text className="text-lg font-semibold">@{creator.username}</Text>
      <Text className="text-sm font-medium">{creator.followers}</Text>
    </TouchableOpacity>
  );
};

const OurTopCreatorSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          OUR TOP CREATORS
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={influencerList}
        keyExtractor={(item, index) => item?.id + index}
        renderItem={({item: creator}) => creatorCard(creator)}
      />
    </View>
  );
};

export default OurTopCreatorSection;
