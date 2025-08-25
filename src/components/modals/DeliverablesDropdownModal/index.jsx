import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import {
  IgPostSVG,
  IgReelSVG,
  IgStorySVG,
  DeliverablesSVG,
} from '../../../utility/icons';

const deliverables = [
  {
    key: 'reels',
    label: 'Max Reels',
    icon: <IgReelSVG />,
  },
  {
    key: 'stories',
    label: 'Max Stories',
    icon: <IgStorySVG />,
  },
  {
    key: 'posts',
    label: 'Max Posts',
    icon: <IgPostSVG />,
  },
];

const DeliverablesDropdownModal = ({
  data = [],
  placeholder = 'Location',
  onSelect,
  selected,
  icon,
  reels,
  stories,
  posts,
}) => {
  const dropdownMaxHeight = 250;
  const {height: windowHeight} = Dimensions.get('window');
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [values, setValues] = React.useState({
    reels: reels ?? 0,
    stories: stories ?? 0,
    posts: posts ?? 0,
  });

  const displayText = selected
    ? typeof selected === 'object'
      ? selected.label || selected.name || selected.value
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

  // Calculate safe dropdown height
  const getDropdownMaxHeight = () => {
    const availableHeight =
      windowHeight - buttonLayout.y - buttonLayout.height - 40;
    return Math.min(dropdownMaxHeight, availableHeight);
  };

  // Handle close
  const handleClose = () => {
    animateOut(() => {
      setIsOpen(false);
    });
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      measureButton();
      setIsOpen(true);
    } else {
      animateOut(() => {
        setIsOpen(false);
      });
    }
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

  const handleChange = (key, delta) => {
    setValues(prev => {
      const newValue = Math.max(0, prev[key] + delta); // minimum is 0
      const updated = {...prev, [key]: newValue};
      return updated;
    });
  };

  const handleApply = () => {
    onSelect(values);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      animateIn();
    }
  }, [isOpen]);

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        className={`border rounded-lg py-[10] px-[10] flex-row gap-[4] w-[140] ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-neutral-400'
        }`}>
        {icon ? icon : <DeliverablesSVG size={18} />}
        <Text
          className="text-neutral-800 text-sm ml-[4] flex-1"
          numberOfLines={1}>
          {displayText}
        </Text>
        {selected ? (
          <TouchableOpacity onPress={() => onSelect(null)}>
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
            className="absolute bg-white rounded-lg border border-gray-200 shadow-lg p-3 flex-col gap-3 w-[220]"
            style={{
              top: buttonLayout.y + buttonLayout.height,
              left: buttonLayout.x - 86,
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
            <View className="flex-col gap-2 flex-1">
              {deliverables.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center flex-1 py-2 px-1 gap-2 rounded-md"
                  onPress={() => {
                    onSelect(item);
                    handleClose();
                  }}>
                  <View className="flex-row flex-1 items-center gap-1">
                    <View className="bg-[#FFF0F0] w-8 h-8 justify-center items-center rounded-full mr-2">
                      {item.icon}
                    </View>
                    <Text className="text-neutral-800 text-sm">
                      {item.label}
                    </Text>
                  </View>
                  <View className="flex-[0.4] flex-row py-2 px-2 items-center gap-2 bg-[#F8FAFC] border border-[#e2e8f0] rounded-md justify-around">
                    <TouchableOpacity
                      onPress={() => handleChange(item.key, -1)}>
                      <Text className="text-[#1A47E8] text-md font-semibold">
                        -
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-gray-700 text-md font-semibold">
                      {values[item.key]}
                    </Text>
                    <TouchableOpacity onPress={() => handleChange(item.key, 1)}>
                      <Text className="text-[#1A47E8] text-md font-semibold">
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <Button title="Apply" onPress={handleApply} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DeliverablesDropdownModal;
