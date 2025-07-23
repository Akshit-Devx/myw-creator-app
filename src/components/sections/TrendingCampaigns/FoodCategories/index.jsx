import {View, Text, Image} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';

export const categoriesList = [
  {
    id: 1,
    name: 'Romantic',
    category: 'romantic',
    image: 'public/custom/images/romantic.jpeg',
  },
  {
    id: 2,
    name: 'Cafe',
    category: 'cafe',
    image: 'public/custom/images/cafe.png',
  },
  {
    id: 3,
    name: 'Luxury Dining',
    category: 'fine-dine',
    image: 'public/custom/images/luxury-dinner.jpeg',
  },
  {
    id: 4,
    name: 'Bar',
    category: 'bar',
    image: 'public/custom/images/bar.jpeg',
  },
  {
    id: 5,
    name: 'Rooftop',
    category: 'rooftop',
    image: 'public/custom/images/rooftop.png',
  },
  {
    id: 6,
    name: 'Multi Cuisine',
    category: 'multi-cuisine',
    image: 'public/custom/images/multi-cuisine.jpeg',
  },
];

const FoodCategoriesSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          WHAT'S YOUR FOOD MOOD?
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <View className="flex-col gap-3">
        <View className="flex-row gap-3">
          {categoriesList.slice(0, 3).map((category, index) => (
            <View
              key={index}
              className="flex-1 flex-col items-center gap- rounded-lg overflow-hidden">
              <Image
                source={{uri: getMediaURL(category.image)}}
                className="w-full h-36"
              />
              <View className="bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0"></View>
              <Text className="absolute bottom-2 left-0 right-0 text-center text-white font-semibold">
                {category.name}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row gap-3">
          {categoriesList.slice(3, 6).map((category, index) => (
            <View
              key={index}
              className="flex-1 flex-col items-center gap-2 rounded-lg overflow-hidden">
              <Image
                source={{uri: getMediaURL(category.image)}}
                className="w-full h-36"
              />
              <View className="bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0"></View>
              <Text className="absolute bottom-2 left-0 right-0 text-center text-white font-semibold">
                {category.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FoodCategoriesSection;
