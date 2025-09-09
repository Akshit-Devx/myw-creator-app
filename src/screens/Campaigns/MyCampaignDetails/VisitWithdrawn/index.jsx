import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import Button from '../../../../components/elements/Button';

const VisitWithdrawn = () => {
  const navigation = useNavigation();
  return (
    <>
      <View
        className="bg-gray-100 border border-gray-200 rounded-lg p-5 m-4"
        style={styles.container}>
        <Text className="text-neutral-800 text-sm font-semibold leading-[25px]">
          Campaign Withdrawn!
        </Text>
        <Text className="text-neutral-800 text-xs font-normal leading-4">
          You have withdrawn from the campaign.
        </Text>
      </View>

      <Button
        title="Explore Campaigns"
        onPress={() => navigation.navigate('Campaigns')}
      />
    </>
  );
};

export default VisitWithdrawn;

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
