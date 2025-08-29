import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';

import DateRangeInfo from './DateRangeInfo';
import {generateTimeSlots, getVisitMonth} from '../../../../utility/helper';
import ElementDropdown from '../../../../components/elements/ElementDropdown';

const VisitDateSelector = ({
  availability,
  type,
  stayDuration,
  selectedDate,
  selectedTime,
  onSubmit,
}) => {
  const days = stayDuration?.days;
  const nights = stayDuration?.nights;

  const [selectedDates, setSelectedDates] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [checkoutDay, setCheckoutDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [value, setValue] = useState(null);

  const timeSlots =
    type !== 'RESORTS' && selectedDay
      ? generateTimeSlots(availability, selectedDay)
      : [];

  const getDatesForSelectedMonth = useCallback(
    value => {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.dates : [];
    },
    [options],
  );

  const getRangeBetweenDates = useCallback(
    (start, end) => {
      const range = [];
      let isInRange = false;
      for (const d of selectedDates) {
        if (d.date === start) isInRange = true;
        if (isInRange) range.push(d.date);
        if (d.date === end) break;
      }
      return range;
    },
    [selectedDates],
  );

  const stayDateRange = useMemo(() => {
    return selectedDay && checkoutDay
      ? getRangeBetweenDates(selectedDay, checkoutDay)
      : [];
  }, [selectedDay, checkoutDay, getRangeBetweenDates]);

  const handleDayClick = (date, isAvailable) => {
    if (!isAvailable) return;

    const selectedDateInfo = selectedDates.find(d => d.date === date);
    const selectedIndex = selectedDates.findIndex(d => d.date === date);

    if (!selectedDateInfo) return;
    setSelectedDay(date);

    const totalDaysForStay = (nights || days || 1) + 1;
    const checkOutDateInfo =
      selectedDates[selectedIndex + totalDaysForStay - 1];
    const checkOutDate = checkOutDateInfo?.date || null;
    setCheckoutDay(checkOutDate);
    setSelectedTimeSlot(null);
    if (type === 'RESORTS') {
      onSubmit({selectedDate: date, checkOutDate});
    } else {
      onSubmit({
        selectedDate: date,
        selectedTimeSlot: selectedTimeSlot,
      });
    }
  };

  const handleMonthChange = useCallback(
    value => {
      const dates = getDatesForSelectedMonth(value);
      setSelectedDates(dates);
      setValue(value);
      setSelectedDay(null);
    },
    [getDatesForSelectedMonth],
  );

  const handleTimeSlotSelect = timeSlot => {
    setSelectedTimeSlot(timeSlot?.displayTime);
    if (selectedDay) {
      if (type === 'RESORTS') {
        onSubmit({selectedDate: selectedDay, checkOutDate: checkoutDay});
      } else {
        onSubmit({
          selectedDate: selectedDay,
          selectedTimeSlot: timeSlot?.displayTime,
        });
      }
    }
  };

  const updateDatesState = useCallback(() => {
    const {defaultValue, options, datesInCurrentMonth} = getVisitMonth(
      availability,
      type,
    );
    setSelectedDates(datesInCurrentMonth);
    setOptions(options);
  }, [availability, type]);

  useEffect(() => {
    if (selectedTime) {
      setSelectedTimeSlot(selectedTime);
    }
    if (selectedDate) {
      setSelectedDay(selectedDate);
    }
  }, [selectedTime, selectedDate]);

  useEffect(() => {
    if (availability && type) {
      updateDatesState();
    }
  }, [availability, type, updateDatesState]);

  const renderItem = ({item: dateInfo}) => {
    const isPastDate = dateInfo.isPastDate;

    const isSelected = dateInfo.date === selectedDay;
    const isCheckout = type === 'RESORTS' && dateInfo.date === checkoutDay;
    const isInRange =
      type === 'RESORTS' && stayDateRange.includes(dateInfo.date);
    console.log('stayDateRange', stayDateRange);
    console.log('isInRange', isInRange);
    const dayStyles = {
      backgroundColor: isSelected
        ? 'white'
        : isCheckout
        ? '#E0F2FE'
        : isInRange
        ? '#EFF6FF'
        : isPastDate || !dateInfo.isAvailable
        ? '#F3F4F6'
        : 'white',
      color: isSelected
        ? '#3B82F6'
        : isCheckout
        ? '#3B82F6'
        : isInRange
        ? '#3B82F6'
        : isPastDate || !dateInfo.isAvailable
        ? '#9CA3AF'
        : 'black',
      opacity: dateInfo.isAvailable ? 1 : 0.5,
      ...(isSelected && {
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 4, // For Android
      }),
      ...(isCheckout && {
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 4, // For Android
      }),
    };
    return (
      <TouchableOpacity
        onPress={() => handleDayClick(dateInfo.date, dateInfo.isAvailable)}
        style={dayStyles}
        className={`flex-col items-center justify-between p-1 border-[2px] rounded-lg w-14 h-18 ${
          isSelected ? 'border-[#3B82F6]' : 'border-[#e0e0e0]'
        }`}>
        <Text className="text-[#121212] text-lg font-semibold">
          {dateInfo.dayOfWeek}
        </Text>
        <Text className="text-[#121212] text-lg font-semibold">
          {new Date(dateInfo.date).getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="border border-gray-200 rounded-lg p-3 flex-col gap-4">
      <Text className="text-[#121212] text-lg font-semibold">
        Choose Visit Date
      </Text>
      {type === 'RESORTS' && (
        <ElementDropdown
          data={options}
          placeholder="Select an option"
          onChange={item => handleMonthChange(item.value)}
          value={value}
          valueField={'value'}
          labelField={'label'}
        />
      )}
      <FlatList
        data={selectedDates.filter(dateInfo => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dateToCheck = new Date(dateInfo.date);
          dateToCheck.setHours(0, 0, 0, 0);

          return (
            !dateInfo.isPastDate && dateToCheck.getTime() > today.getTime()
          );
        })}
        renderItem={renderItem}
        keyExtractor={item => item.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-4 px-2"
      />
      {selectedDay && <View className="h-[1] w-full bg-gray-300" />}
      {selectedDay && type !== 'RESORTS' && timeSlots.length > 0 && (
        <View className="flex-col gap-4">
          <Text className="text-[#121212] text-lg font-semibold">
            Choose Slots
          </Text>
          <FlatList
            data={timeSlots}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleTimeSlotSelect(item)}
                className={`flex-col items-center justify-between p-2 border rounded-lg ${
                  selectedTimeSlot === item.displayTime
                    ? 'border-[#0284c7] bg-[#e0f2fe]'
                    : 'border-[#3B82F6]'
                }`}>
                <Text
                  className={`text-lg font-semibold ${
                    selectedTimeSlot === item.displayTime
                      ? 'text-[#0284c7]'
                      : 'text-[#3B82F6]'
                  }`}>
                  {item.displayTime}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row gap-4 px-2"
          />
        </View>
      )}
      {selectedDay && type === 'RESORTS' && (
        <DateRangeInfo
          checkIn={selectedDay}
          checkOut={checkoutDay}
          selectedTime={selectedTimeSlot}
          type={type}
        />
      )}
    </View>
  );
};

export default memo(VisitDateSelector);
