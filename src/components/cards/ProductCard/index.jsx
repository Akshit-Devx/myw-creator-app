import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Image, Linking, TouchableOpacity} from 'react-native';

import {twMerge} from 'tailwind-merge';

import {PNGs} from '../../../assets/png';
import Button from '../../elements/Button';
import Checkbox from '../../elements/Checkbox';
import {getMediaURL} from '../../../utility/helper';

const ProductCard = ({product, isSelected, onSelect}) => {
  const productImage = useMemo(
    () =>
      product?.media?.[0]?.link?.[0]
        ? {uri: getMediaURL(product?.media?.[0]?.link?.[0])}
        : PNGs.DummyBanner,
    [product],
  );

  return (
    <TouchableOpacity
      onPress={() => onSelect(product?.id)}
      activeOpacity={0.8}
      style={[isSelected && styles.shadow]}
      className={twMerge(
        `w-[48%] mb-[4%] bg-white border p-[16] rounded-lg ${
          isSelected ? 'border-[#1946e7]' : 'border-[#9c2cf3]'
        }`,
      )}>
      <View className="flex-col gap-2 justify-center items-center">
        <Image
          source={productImage}
          className="w-[70] h-[70] rounded-lg"
          resizeMode="cover"
        />
        <View className="justify-center items-center">
          <Text className="text-sm font-semibold text-neutral-800">
            {product.name}
          </Text>
          <Text className="text-xs font-normal text-neutral-400">
            {product.description}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-neutral-800">
          ₹{product.price?.toLocaleString()}
        </Text>
        {product.link && product.link.trim() !== '' && (
          <Button
            title="Visit Link ↗"
            onPress={() => Linking.openURL(product.link)}
            className="rounded-lg"
          />
        )}
      </View>
      <View className="absolute top-3 right-3">
        <Checkbox checked={isSelected} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#406aff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 10.4,
    elevation: 8,
  },
});
