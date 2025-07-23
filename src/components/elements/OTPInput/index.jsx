import {useRef, useState} from 'react';
import {View, TextInput, Clipboard} from 'react-native';

const OTPInput = ({
  length = 4,
  value = '',
  onChange,
  disabled = false,
  error = false,
  className = '',
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChangeText = (text, index) => {
    const newValue = value.split('');
    newValue[index] = text;
    const finalValue = newValue.join('');
    onChange?.(finalValue);

    // Move to next input if there's a value
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getString();
      const cleanText = text.replace(/\D/g, '').slice(0, length);
      onChange?.(cleanText);

      // Focus the next empty input after the pasted text
      const nextEmptyIndex =
        cleanText.length < length ? cleanText.length : length - 1;
      inputRefs.current[nextEmptyIndex]?.focus();
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between gap-3 ${className}`}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            value={value[index] || ''}
            onChangeText={text => handleChangeText(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onPaste={handlePaste}
            maxLength={1}
            keyboardType="number-pad"
            editable={!disabled}
            className={`w-14 h-14 text-center text-xl font-semibold rounded-xl border-2 ${
              disabled
                ? 'bg-gray-50'
                : error
                ? 'border-red-500'
                : focusedIndex === index
                ? 'border-[#1946E7]'
                : 'border-gray-300'
            }`}
          />
        ))}
    </View>
  );
};

export default OTPInput;
