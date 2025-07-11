import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const {width} = Dimensions.get('screen');

const PercentageSlider = ({min = 0, max = 100, value = 0, onChange}) => {
  const handleValueChange = newVal => {
    onChange?.(newVal[0]);
  };

  return (
    <View className="w-full flex flex-col gap-2">
      <MultiSlider
        values={[value]}
        min={0}
        max={100}
        step={1}
        onValuesChange={handleValueChange}
        selectedStyle={{backgroundColor: '#0033e6'}}
        unselectedStyle={{backgroundColor: '#E4E4E7'}}
        markerStyle={{
          backgroundColor: '#FFFFFF',
          borderWidth: 4,
          borderColor: '#0033e6',
          height: 20,
          width: 20,
          marginTop: 6,
          borderRadius: 9999,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 2,
          elevation: 2,
        }}
        trackStyle={{
          height: 8,
          borderRadius: 9999,
        }}
        containerStyle={{
          paddingHorizontal: 8,
        }}
        sliderLength={width - 60}
      />
    </View>
  );
};

export default PercentageSlider;
