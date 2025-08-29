import React from 'react';
import {View, Text} from 'react-native';
import {Icons} from '../../../../../assets/icons';

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 0;
  }
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return 0;
  }

  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0);
};

const formatDate = isoString => {
  if (!isoString) return 'Invalid Date';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    weekday: 'short',
  })
    .format(date)
    .replace(',', '')
    .replace(' ', "'");
};

const DateRangeInfo = ({checkIn, checkOut, selectedTime, type}) => {
  const formattedCheckIn = formatDate(checkIn);
  const formattedCheckOut = formatDate(checkOut);
  const nights = calculateNights(checkIn, checkOut);
  return (
    <View className="flex-row max-w-full p-3 rounded-lg bg-blue-100 w-full items-center justify-between">
      <View className="flex-row items-center justify-between gap-2">
        <Icons.DayCalenderIcon width={18} height={18} />
        <Text className="text-sm font-semibold text-gray-900 whitespace-nowrap">
          {formattedCheckIn}
        </Text>
        {type === 'RESORTS' && (
          <View className="flex-row px-2 py-0.5 justify-center items-center rounded-full bg-white">
            <Text className="text-[8px] font-medium text-gray-500 text-center">
              {nights} NIGHT{nights !== 1 ? 'S' : ''}
            </Text>
          </View>
        )}
        {checkOut && type === 'RESORTS' && (
          <Text className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {formattedCheckOut}
          </Text>
        )}
      </View>
      {selectedTime && (
        <Text className="text-sm font-semibold text-gray-900">
          {selectedTime}
        </Text>
      )}
    </View>
  );
};

export default DateRangeInfo;
