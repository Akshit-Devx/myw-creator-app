import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icons} from '../../../assets/icons';

const SearchBar = () => {
  return (
    <View className="flex-row bg-white shadow-sm py-4 items-center justify-between rounded-full mx-6 mt-2 border border-[#F9F9F9] px-4 ">
      <View className="flex-row items-center gap-2">
        <Icons.Search />
        <Text className="text-[#B5B5C5] font-semibold text-base">
          Search For Brands, Offers...
        </Text>
      </View>
      <View className="border-l border-gray-200 pl-3 mr-2">
        <Icons.Mic />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
