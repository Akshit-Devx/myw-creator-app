import {View, Text, TouchableOpacity, Platform} from 'react-native';
import React from 'react';
import {CAMPAIGN_TYPES} from '../../../utility/common';
import LinearGradient from 'react-native-linear-gradient';

const CampaignTypeButton = ({selectedType, setSelectedType}) => {
  return (
    <View className="flex-row gap-3 border border-gray-100 rounded-full p-1 bg-white">
      {CAMPAIGN_TYPES?.map(item => {
        return (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedType(item)}
            className={`flex-1 rounded-full `}>
            {selectedType === item ? (
              <View
                style={{
                  ...Platform.select({
                    ios: {
                      shadowColor: '#9C2CF37D',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 1,
                      shadowRadius: 15,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }}>
                <LinearGradient
                  colors={['#9C2CF3', '#1A47E8']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={{borderRadius: 100}}>
                  <Text
                    className={`text-center py-2 text-lg font-medium ${
                      selectedType === item ? 'text-white' : ''
                    }`}>
                    {item}
                  </Text>
                </LinearGradient>
              </View>
            ) : (
              <Text
                className={`text-center py-2 text-lg font-medium ${
                  selectedType === item ? 'text-white' : ''
                }`}>
                {item}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CampaignTypeButton;
