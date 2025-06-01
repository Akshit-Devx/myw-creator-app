import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
// import {Icons} from '../../../assets/images/icons';

const TabItem = memo(({label, icon, activeIcon, isFocused, onPress}) => {
  const isQrScanner = label === 'QrScanner';
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 items-center justify-center py-2 ${
        isFocused ? '' : ''
      }`}>
      {isQrScanner ? (
        <View className="scale-150">{isFocused ? activeIcon : icon}</View>
      ) : (
        <>
          {isFocused ? activeIcon : icon}
          <Text
            className={`text-sm mt-1 ${
              isFocused ? 'text-[#1946E7] font-medium' : 'text-gray-500'
            }`}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
});

const BottomTab = ({state, descriptors, navigation}) => {
  // const tabIcons = useMemo(
  //   () => ({
  //     Home: {
  //       default: <Icons.Home width={24} height={24} />,
  //       active: <Icons.HomeActive width={24} height={24} />,
  //     },
  //     Bookings: {
  //       default: <Icons.Bookings width={24} height={24} />,
  //       active: <Icons.BookingsActive width={24} height={24} />,
  //     },
  //     History: {
  //       default: <Icons.History width={24} height={24} />,
  //       active: <Icons.HistoryActive width={24} height={24} />,
  //     },
  //     Profile: {
  //       default: <Icons.Profile width={24} height={24} />,
  //       active: <Icons.ProfileActive width={24} height={24} />,
  //     },
  //     QrScanner: {
  //       default: <Icons.QrScanner width={56} height={56} />,
  //       active: <Icons.QrScanner width={56} height={56} />,
  //     },
  //   }),
  //   [],
  // );

  return (
    <View className="flex-row bg-white border-t border-gray-200">
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TabItem
            key={route.key}
            label={label}
            // icon={tabIcons[route.name].default}
            // activeIcon={tabIcons[route.name].active}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
};

export default memo(BottomTab);
