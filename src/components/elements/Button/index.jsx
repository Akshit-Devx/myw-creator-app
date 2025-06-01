import React from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
}) => {
  const variants = {
    primary: 'bg-[#1946E7] active:bg-[#1946E7]/80',
    secondary: 'bg-white border border-[#1F0B48] active:bg-gray-50',
    ghost: 'bg-transparent active:bg-gray-50',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-[#1F0B48]',
    ghost: 'text-[#1946E7]',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center rounded-full ${
        variants[variant]
      } ${sizes[size]} ${disabled ? 'opacity-70' : ''} ${className}`}>
      <View className="flex-row items-center gap-2 min-w-[100px] h-full justify-center">
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? 'white' : '#1F0B48'}
          />
        ) : (
          <>
            {leftIcon && <View>{leftIcon}</View>}
            <Text
              className={`font-semibold ${textColors[variant]} ${
                disabled ? 'opacity-70' : ''
              }`}>
              {title}
            </Text>
            {rightIcon && <View>{rightIcon}</View>}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Button;
