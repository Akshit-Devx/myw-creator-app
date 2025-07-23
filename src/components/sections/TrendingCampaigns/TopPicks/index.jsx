import {View, Text, FlatList, Image} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';

const topPicksBannerList = [
  {
    id: 1,
    name: 'RESORTS',
    image: 'public/custom/images/summer-hotels.png',
  },
  {
    id: 2,
    name: 'SALONS',
    image: 'public/custom/images/free-salon.png',
  },
  {
    id: 3,
    name: 'RESTAURANTS',
    image: 'public/custom/images/pick-your-food.png',
  },
];

const TopPicksSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          TOP PICKS THIS WEEK
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={topPicksBannerList}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({item}) => (
          <View>
            <Image
              source={{uri: getMediaURL(item?.image)}}
              className="w-96 h-40 object-contain rounded-xl"
            />
          </View>
        )}
      />
    </View>
  );
};

export default TopPicksSection;
