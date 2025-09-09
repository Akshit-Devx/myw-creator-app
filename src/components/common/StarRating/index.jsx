import React, {useRef, useState} from 'react';
import {View, Animated, Easing, TouchableOpacity} from 'react-native';

import {StarRatingSVG} from '../../../utility/icons';

const StarRating = ({
  totalStars = 5,
  onRate,
  initialRating = 0,
  readOnly = false,
  size = 31,
}) => {
  const [rating, setRating] = useState(initialRating);
  const animatedValues = useRef(
    Array(totalStars)
      .fill()
      .map(() => new Animated.Value(0)),
  ).current;

  const handlePressIn = index => {
    if (readOnly) return;
    Animated.timing(animatedValues[index], {
      toValue: 1,
      duration: 200, // 0.2s
      easing: Easing.ease, // Matches ease transition
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = index => {
    if (readOnly) return;
    Animated.timing(animatedValues[index], {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = rate => {
    if (readOnly) return;
    setRating(rate);
    onRate?.(rate);
  };
  return (
    <View className="flex flex-row items-center gap-1.5">
      {Array.from({length: totalStars}, (_, i) => {
        const starValue = i + 1;
        const scale = animatedValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        return (
          <Animated.View
            key={starValue}
            style={{transform: [{scale}]}}
            className="cursor-pointer">
            <TouchableOpacity
              onPressIn={() => handlePressIn(i)}
              onPressOut={() => handlePressOut(i)}
              onPress={() => handlePress(starValue)}
              disabled={readOnly}
              activeOpacity={1}>
              <StarRatingSVG
                color={starValue <= rating ? '#FFD029' : '#EFF0F9'}
                size={size}
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default StarRating;
