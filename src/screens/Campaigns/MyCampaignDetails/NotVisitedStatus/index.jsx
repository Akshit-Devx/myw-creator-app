import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import StarRating from '../../../../components/common/StarRating';

const NotVisitedStatus = () => {
  return (
    <View className="flex-col gap-4 mt-4">
      <View
        className="bg-gray-50 border border-gray-200 rounded-lg p-5"
        style={styles.shadow}>
        <View>
          <Text className="text-neutral-800 text-sm font-semibold leading-[25px]">
            Your Campaign was Incomplete!
          </Text>
          <View className="mt-2">
            <Text className="text-neutral-800 text-xs font-normal leading-4">
              Such actions may result in the suspension of your account and
              could prevent you from applying for future opportunities with us.
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-neutral-800 text-lg font-semibold leading-[25px]">
          Brand Review
        </Text>
        <View
          className="bg-gray-50 border border-gray-200 rounded-lg p-6"
          style={styles.shadow}>
          <View className="flex flex-row items-center gap-1">
            <Text className="text-neutral-800 text-xs font-normal">0</Text>
            <StarRating totalStars={5} initialRating={0} readOnly size={18} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotVisitedStatus;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
