import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  Platform,
  Keyboard,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icons} from '../../../assets/icons';

const AvgViewsFilterModal = ({
  placeholder = 'Location',
  onApply,
  selected,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [minValue, setMinValue] = useState(selected?.min ?? '');
  const [maxValue, setMaxValue] = useState(selected?.max ?? '');
  const [isMinValid, setIsMinValid] = useState(true);

  const dropdownMaxHeight = 250;
  const {height: windowHeight} = Dimensions.get('window');
  const buttonRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Get display text (either from selected item or placeholder)
  const displayText = selected
    ? typeof selected === 'object'
      ? `${selected?.minFollowers} - ${selected?.maxFollowers}`
      : selected
    : placeholder;

  // Animation functions
  const animateIn = () => {
    // Reset animation values
    slideAnim.setValue(-20);
    fadeAnim.setValue(0);

    // Run animations in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = callback => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  // Measure button position
  const measureButton = () => {
    if (buttonRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        buttonRef.current.measureInWindow((x, y, width, height) => {
          setButtonLayout({x, y, width, height});
        });
      }, 10);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    Keyboard.dismiss();

    if (!isOpen) {
      measureButton();
      setIsOpen(true);
    } else {
      animateOut(() => {
        setIsOpen(false);
      });
    }
  };

  // Animate when modal opens
  useEffect(() => {
    if (isOpen) {
      animateIn();
    }
  }, [isOpen]);

  // Handle close
  const handleClose = () => {
    animateOut(() => {
      setIsOpen(false);
    });
  };

  // Calculate safe dropdown height
  const getDropdownMaxHeight = () => {
    const availableHeight =
      windowHeight - buttonLayout.y - buttonLayout.height - 40;
    return Math.min(dropdownMaxHeight, availableHeight);
  };

  const handleApply = () => {
    if (minValue.trim()) {
      animateOut(() => {
        onApply?.({minFollowers: minValue, maxFollowers: maxValue});
        setIsOpen(false);
      });
    } else {
      setIsMinValid(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        className={`border rounded-lg py-[10] px-[10] flex-row gap-[4] w-[150] ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-neutral-400'
        }`}>
        {icon ? icon : <Text className="text-lg leading-[0]">👁️</Text>}
        <Text
          className="text-neutral-800 text-sm ml-[4] flex-1"
          numberOfLines={1}>
          {displayText}
        </Text>
        {selected ? (
          <TouchableOpacity onPress={() => onApply({minFollowers: null, maxFollowers: null})}>
            <Icons.CrossIcon width={18} height={18} />
          </TouchableOpacity>
        ) : (
          <Icons.ChevronDown width={18} height={18} />
        )}
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}>
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1"
          onPress={handleClose}>
          {/* Animated dropdown */}
          <Animated.View
            className="absolute bg-white rounded-lg border border-gray-200 shadow-lg p-3"
            style={{
              top: buttonLayout.y + buttonLayout.height,
              left: buttonLayout.x,
              width: buttonLayout.width,
              maxHeight: getDropdownMaxHeight(),
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
              ...Platform.select({
                android: {
                  elevation: 5,
                },
                ios: {
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
              }),
            }}>
            <View className="flex-1 gap-[10]">
              <View className="flex-1">
                <TextInput
                  placeholderTextColor="#999"
                  className={`border border-gray-300 rounded-lg px-4 py-3 text-base w-full ${
                    isMinValid ? 'bg-gray-50' : 'border-red-500'
                  }`}
                  placeholder="Min"
                  onChangeText={text => {
                    setMinValue(text);
                    setIsMinValid(true);
                  }}
                  value={minValue}
                  keyboardType="number-pad"
                />
                {!isMinValid && (
                  <Text className="text-red-500 text-xs mt-1">
                    Please enter min value
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholderTextColor="#999"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 w-full"
                  placeholder="Max"
                  onChangeText={text => setMaxValue(text)}
                  value={maxValue}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View className="mt-3">
              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-4 items-center"
                onPress={handleApply}>
                <Text className="text-white text-base font-semibold">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AvgViewsFilterModal;
