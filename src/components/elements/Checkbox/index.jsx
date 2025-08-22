import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

const Checkbox = ({checked, onChange, label, disabled = false}) => {
  return (
    <TouchableOpacity
      onPress={onChange}
      disabled={disabled}
      className={`flex-row items-center space-x-2 rounded-lg ${
        disabled ? 'opacity-50' : ''
      } ${label ? "gap-[10]" : ""}`}>
      <View
        className={`w-6 h-6 rounded-lg border-2  ${
          checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
        }`}>
        {checked && (
          <View className="flex-1 flex justify-center items-center">
            <Text className="text-white font-bold text-md">✓</Text>
          </View>
        )}
      </View>
      {label && (
        <Text className={`text-gray-700 ${disabled ? 'text-gray-400' : ''}`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Checkbox;
