import React from 'react';
import {View, Text, Image, Linking} from 'react-native';

import {PNGs} from '../../../assets/png';
import Button from '../../elements/Button';
import {getMediaURL} from '../../../utility/helper';

const ProductDetailsCard = ({product}) => {
  const productImage =
    product?.productImage || product?.media?.[0]?.link[0]
      ? getMediaURL(product?.media?.[0]?.link[0] || product?.productImage || '')
      : PNGs.DummyBanner;

  return (
    <View className="border border-[#9c2cf3] p-2 rounded-lg flex-row gap-4 bg-white">
      <Image source={productImage} className="w-[70] h-[70] rounded-lg" />
      <View className="flex-1 flex-col gap-2">
        <View className="flex-row justify-between">
          <Text className="text-lg text-neutral-800 font-semibold">
            {product?.name}
          </Text>
          <Text className="text-md text-neutral-800 font-semibold">
            {product?.price?.toLocaleString() || '₹0'}
          </Text>
        </View>
        <Text className="text-sm text-neutral-800 font-medium">
          {product?.description || 'Women Running Shoes'}
        </Text>
        {(product?.link || product?.productLink) && (
          <View className="flex-row">
            <Button
              title="Visit Link ↗"
              onPress={() =>
                Linking.openURL(product?.link || product?.productLink)
              }
              className="rounded-lg"
              size={'sm'}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ProductDetailsCard;
