import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

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
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    if (count > 0) {
      const newValue = count - stepSize;
      setCount(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <View className="flex-row gap-3 items-center">
      <TouchableOpacity
        className="p-4 border border-[#e5e7eb] bg-white rounded-xl"
        onPress={handleDecrement}>
        <Text classname="text-[#4f46e5] text-[20px]">-</Text>
      </TouchableOpacity>
      <Text classname="text-base min-w-5 text-center font-medium">{count}</Text>
      <TouchableOpacity
        className="p-4 border border-[#e5e7eb] bg-white rounded-xl"
        onPress={handleIncrement}>
        <Text classname="text-[#4f46e5] text-[20px]">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Counter;
