import React from 'react';
import {ActivityIndicator, Modal, Text, View} from 'react-native';
import {twMerge} from 'tailwind-merge';

const FullScreenLoader = ({
  visible = false,
  text = 'Loading...',
  size = 'large',
  color = '#3B82F6',
  backgroundColor = 'rgba(0, 0, 0, 0.5)',
  textColor = 'white',
  containerClassName,
  loaderClassName,
  textClassName,
  showText = true,
  animationType = 'fade',
  transparent = true,
}) => {
  const baseContainerStyles = 'flex-1 justify-center items-center';
  const baseLoaderStyles = 'mb-4';
  const baseTextStyles = 'text-base font-medium text-center';

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      statusBarTranslucent>
      <View
        className={twMerge(baseContainerStyles, containerClassName)}
        style={{backgroundColor}}>
        <View className="items-center">
          <ActivityIndicator
            size={size}
            color={color}
            className={twMerge(baseLoaderStyles, loaderClassName)}
          />

          {showText && text && (
            <Text
              className={twMerge(baseTextStyles, textClassName)}
              style={{color: textColor}}>
              {text}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FullScreenLoader;
