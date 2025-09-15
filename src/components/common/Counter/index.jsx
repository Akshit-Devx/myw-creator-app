import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

const Counter = ({
  initialValue = 1,
  maximumValue = 100,
  stepSize = 1,
  onChange,
}) => {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    if (count >= maximumValue) return;
    const newValue = count + stepSize;
    setCount(newValue);
    onChange && onChange(newValue);
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newValue = count - stepSize;
      setCount(newValue);
      onChange && onChange(newValue);
    }
  };

  return (
    <View className="flex-row items-center space-x-3">
      <TouchableOpacity
        className="w-9 h-9 rounded-lg border border-gray-200 bg-white justify-center items-center"
        onPress={handleDecrement}
        accessibilityLabel="Decrease"
        activeOpacity={0.7}>
        <Text className="text-indigo-600 text-xl leading-none">−</Text>
      </TouchableOpacity>

      <Text className="text-base font-medium text-center min-w-[20px]">
        {count}
      </Text>

      <TouchableOpacity
        className="w-9 h-9 rounded-lg border border-gray-200 bg-white justify-center items-center"
        onPress={handleIncrement}
        accessibilityLabel="Increase"
        activeOpacity={0.7}>
        <Text className="text-indigo-600 text-xl leading-none">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Counter;
