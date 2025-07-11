import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  OFFER,
  offerNavTabs,
  barterNavTabs,
} from '../components/Filters/filterOptions';

const NavigationTabs = ({selectedIndex, filterParams, updateQueryParams}) => {
  const tabs = selectedIndex === OFFER ? offerNavTabs : barterNavTabs;

  return (
    <View className="flex-row items-center justify-center gap-2">
      {tabs.map(item => {
        const [actualKey] = item.key.split('-');
        const isActive =
          filterParams[actualKey]?.toString() === item.value.toString();

        return (
          <TouchableOpacity
            key={item.key}
            onPress={() =>
              updateQueryParams({
                [actualKey]: isActive ? undefined : item.value.toString(),
              })
            }
            className={`px-4 py-2 rounded-xl border ${
              isActive
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300'
            }`}>
            <Text
              className={`text-sm font-medium ${
                isActive ? 'text-blue-700' : 'text-gray-600'
              }`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavigationTabs;
