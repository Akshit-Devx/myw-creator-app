// IOSSwitch.js
import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableWithoutFeedback, Animated} from 'react-native';

const IOSSwitch = ({value = false, onValueChange, disabled = false}) => {
  const [isOn, setIsOn] = useState(value);
  const offsetX = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(offsetX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setIsOn(value);
  }, [value]);

  const toggleSwitch = () => {
    if (disabled) return;
    const newValue = !isOn;
    setIsOn(newValue);
    onValueChange?.(newValue);

    Animated.timing(offsetX, {
      toValue: newValue ? 20 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View
        className={`w-[50px] h-[30px] rounded-full p-1 justify-center ${
          isOn ? 'bg-green-500' : 'bg-gray-300'
        }`}>
        <Animated.View
          className="w-6 h-6 rounded-full bg-white"
          style={{
            transform: [{translateX: offsetX}],
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: {width: 0, height: 1},
            shadowRadius: 1.5,
            elevation: 2,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default IOSSwitch;
