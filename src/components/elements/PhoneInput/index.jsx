import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';

const PhoneInput = ({
  value,
  onChangeText,
  error,
  disabled = false,
  placeholder = 'Enter phone number',
  className = '',
  countryCode = '+91',
  label,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChangeText = text => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    // Limit to 10 digits
    const truncatedText = cleanedText.slice(0, 10);
    // Format the number with spaces
    const formattedText = truncatedText.replace(/(.{5})/g, '$1 ').trim();
    onChangeText?.(formattedText);
  };

  return (
    <View className={`w-full ${className}`}>
      {label && (
        <Text className="mb-1.5 text-base font-medium text-[#191919]">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-lg overflow-hidden ${
          error
            ? 'border-red-500'
            : isFocused
            ? 'border-[#1946E7]'
            : 'border-gray-300'
        } ${disabled ? 'bg-gray-50' : 'bg-white'}`}>
        {/* Country Code */}
        <View className="px-3 py-3 border-r border-r-gray-300">
          <Text className="text-base font-medium text-gray-700">
            {countryCode}
          </Text>
        </View>

        {/* Phone Input */}
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={12} // 10 digits + 1 space
          editable={!disabled}
          textAlignVertical="center"
          className="flex-1 px-3 py-3 text-base text-gray-900"
        />
      </View>

      {/* Error Message */}
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default PhoneInput;
