import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import {twMerge} from 'tailwind-merge';

// Enable LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ExpandableText = ({
  text = '',
  numberOfLines = 3,
  textClassName = '',
  containerClassName = '',
  moreTextClassName = '',
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef(null);

  const handleTextLayout = useCallback(
    e => {
      // Capture the line height from the constrained Text component
      const linesRendered = e.nativeEvent?.lines?.length;
      if (linesRendered > numberOfLines) {
        // Measure the full text height using the hidden Text component
        setShowReadMore(true);
      } else {
        setShowReadMore(false);
      }
    },
    [numberOfLines],
  );

  const toggleNumberOfLines = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMore(!showMore);
  }, [showMore]);

  if (!text) return null;

  return (
    <View className={twMerge('my-1', containerClassName)}>
      {/* Hidden Text to measure full height */}
      <Text
        ref={textRef}
        className={
          'text-base leading-6 text-[#333] absolute opacity-[0] w-full'
        }
        onTextLayout={handleTextLayout}>
        {text}
      </Text>
      {/* Visible Text */}
      <Text
        className={twMerge('text-base leading-6 text-[#333]', textClassName)}
        numberOfLines={showMore ? undefined : numberOfLines}>
        {text}
      </Text>
      {showReadMore && (
        <TouchableOpacity
          onPress={toggleNumberOfLines}
          className="mt-1"
          accessibilityLabel={showMore ? 'See Less' : 'See More'}>
          <Text
            className={twMerge('text-base font-semibold', moreTextClassName)}>
            {showMore ? 'See Less' : 'See More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(ExpandableText);
