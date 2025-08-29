import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {Icons} from '../../../../../assets/icons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AvailabilityDropdown = ({availability}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentDay = availability?.[new Date().getDay()] || {};

  const handleToggle = () => {
    LayoutAnimation.easeInEaseOut();
    setIsOpen(!isOpen);
  };

  return (
    <View className="flex-col gap-4 bg-[#FAFCFE] rounded-lg p-4 border border-gray-200">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleToggle}
        className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Icons.CalendarTodayIcon width={18} height={18} />
          <Text className="text-lg font-semibold text-neutral-800">
            {currentDay?.day || '-'}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-medium">
            {`${currentDay?.openTime || '-'} AM`} - {`${currentDay?.closeTime || '-'} PM`}
          </Text>
          {isOpen ? (
            <Icons.ChevronUp width={26} height={26} />
          ) : (
            <Icons.ChevronDown width={26} height={26} />
          )}
        </View>
      </TouchableOpacity>
      {isOpen && (
        <>
          <View className="h-[1] w-full bg-gray-300" />
          <View className="flex-col gap-2">
            {availability?.map((item, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Icons.CalendarTodayIcon width={18} height={18} />
                  <Text className="text-lg font-medium text-neutral-800">
                    {item?.day}
                  </Text>
                </View>
                <Text className="text-lg font-medium">
                  {`${item?.openTime} AM`} - {`${item?.closeTime} PM`}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default AvailabilityDropdown;
