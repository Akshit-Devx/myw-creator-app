import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icons} from '../../../assets/icons';

const DetailStackHeader = ({
  title = 'Default Title',
  onLeftPress,
  onRightPress,
  showLeftButton = true,
  showRightButton = true,
  leftIcon = <Icons.BackIcon width={20} height={20} />,
  rightIcon,
  containerStyle = '',
  titleStyle = '',
}) => {
  return (
    <View
      className={`flex-row items-center bg-white justify-between px-4 py-2 ${containerStyle}`}>
      {showLeftButton ? (
        <TouchableOpacity
          onPress={onLeftPress}
          activeOpacity={0.7}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
          className="p-2">
          {leftIcon}
        </TouchableOpacity>
      ) : (
        <View className="w-[20]" />
      )}
      <Text
        className={`text-2xl flex-1 text-center text-gray-800 font-semibold ${titleStyle}`}>
        {title}
      </Text>
      {showRightButton && rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          activeOpacity={0.7}
          hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
          className="p-2">
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View className="w-[20] p-2" />
      )}
    </View>
  );
};

export default DetailStackHeader;
