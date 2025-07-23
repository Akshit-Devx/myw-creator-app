import {Text, TextInput, View} from 'react-native';
import {twMerge} from 'tailwind-merge';

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  containerClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  helperClassName,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  maxLength,
  onFocus,
  onBlur,
  disabled = false,
  ...props
}) => {
  const baseContainerStyles = 'mb-4';

  const baseLabelStyles = 'text-gray-700 text-md font-medium mb-2';

  const baseInputStyles = twMerge(
    'border rounded-lg px-4 py-3 text-base bg-white',
    'border-gray-300 text-gray-900',
    'focus:border-blue-600 focus:ring-2 focus:ring-blue-200',
    multiline && 'min-h-[100px] text-top',
    error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
    !editable && 'bg-gray-100 text-gray-500',
    disabled && 'bg-gray-100 border-gray-300',
  );

  const baseErrorStyles = 'text-red-500 text-sm mt-1';
  const baseHelperStyles = 'text-gray-500 text-sm mt-1';

  return (
    <View className={twMerge(baseContainerStyles, containerClassName)}>
      {label && (
        <Text className={twMerge(baseLabelStyles, labelClassName)}>
          {label}
        </Text>
      )}

      <TextInput
        className={twMerge(baseInputStyles, inputClassName)}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor="#9CA3AF"
        {...props}
      />

      {error && (
        <Text className={twMerge(baseErrorStyles, errorClassName)}>
          {error}
        </Text>
      )}

      {!error && helperText && (
        <Text className={twMerge(baseHelperStyles, helperClassName)}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default InputField;
