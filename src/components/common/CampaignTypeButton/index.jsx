import {View, Text, TouchableOpacity} from 'react-native';
import {CAMPAIGN_TYPES_TAB} from '../../../utility/common';
import LinearGradient from 'react-native-linear-gradient';

const CampaignTypeButton = ({selectedType, setSelectedType}) => {
  return (
    <View className="flex-row gap-3 border border-gray-100 rounded-full p-1">
      {CAMPAIGN_TYPES_TAB?.map(item => {
        if (item?.value === selectedType?.value) {
          return (
            <TouchableOpacity className="flex-1">
              <LinearGradient
                colors={['#9c2cf3', '#1a47e8']}
                locations={[0, 1]}
                start={{x: 0.5, y: 0}}
                end={{x: 0.5, y: 1}}
                style={{flex: 1, borderRadius: 100}}>
                <Text className="text-center py-2 text-lg font-medium text-white">
                  {item?.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={item?.value}
            onPress={() => setSelectedType(item)}
            className="flex-1 rounded-full">
            <Text className="text-center py-2 text-lg font-medium text-gray-700">
              {item?.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CampaignTypeButton;
