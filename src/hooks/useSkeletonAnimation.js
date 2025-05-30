import {useRef, useEffect, useMemo} from 'react';
import {Animated} from 'react-native';

export const useSkeletonAnimation = (
  startValue = 0.3,
  endValue = 0.7,
  duration = 500,
) => {
  const animatedValue = useRef(new Animated.Value(startValue)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: endValue,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: startValue,
          duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue, startValue, endValue, duration]);

  const AnimatedView = useMemo(
    () => Animated.createAnimatedComponent(Animated.View),
    [],
  );

  return {
    opacity: animatedValue,
    AnimatedView,
  };
};
