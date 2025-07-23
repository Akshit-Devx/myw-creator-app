import {View, Text, TouchableOpacity} from 'react-native';
import {CAMPAIGN_TYPES} from '../../../utility/common';

const CampaignTypeButton = ({selectedType, setSelectedType}) => {
  return (
    <View className="flex-row gap-3 border border-gray-100 rounded-full p-1">
      {CAMPAIGN_TYPES?.map(item => {
        return (
          <TouchableOpacity
            key={item}
            onPress={() => setSelectedType(item)}
            className={`flex-1 rounded-full ${
              selectedType === item ? 'bg-[#0033e6]' : ''
            }`}>
            <Text
              className={`text-center py-2 text-lg font-medium ${
                selectedType === item ? 'text-white' : ''
              }`}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CampaignTypeButton;
