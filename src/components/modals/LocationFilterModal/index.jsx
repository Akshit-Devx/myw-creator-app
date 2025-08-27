import {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  Animated,
  Keyboard,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {Icons} from '../../../assets/icons';

const LocationFilterModal = ({
  data = [],
  placeholder = 'Location',
  onSelect,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const dropdownMaxHeight = 250;
  const {height: windowHeight} = Dimensions.get('window');
  const buttonRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Get display text (either from selected item or placeholder)
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

  // Handle selection
  const handleSelect = item => {
    animateOut(() => {
      onSelect(item);
      setIsOpen(false);
    });
  };

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

  const handleSearch = text => {
    setSearchQuery(text);
    if (text) {
      const newData = data.filter(item => {
        const itemData = item.label
          ? item.label.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = ({item, index}) => {
    const itemValue =
      typeof item === 'object' ? item : {value: item, label: item};
    const label = itemValue.label || itemValue.name || itemValue.value;

    return (
      <TouchableOpacity
        key={index}
        className="py-3 px-2 border-b border-gray-100 active:bg-gray-50 flex-row gap-[8] items-center"
        onPress={() => handleSelect(item)}>
        <Icons.LocationMarkIcon width={16} height={16} />
        <Text className="text-base text-gray-700">{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        activeOpacity={0.7}
        className={`border rounded-lg py-[10] px-[10] flex-row gap-[4] w-[145] ${
          selected ? 'border-blue-500 bg-blue-50' : 'border-neutral-400'
        }`}>
        {icon ? icon : <Icons.LocationPinIcon width={18} height={18} />}
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
            className="absolute bg-white rounded-lg border border-gray-200 shadow-lg p-3 flex-col gap-3"
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
            <View className="bg-[#EFF6FF] flex-row items-center h-[30] gap-[8] p-[6]">
              <Icons.SearchLocationIcon width={18} height={18} />
              <TextInput
                placeholder="Search"
                placeholderTextColor={'#1E75E580'}
                className={'text-sm text-[#1E75E580] font-semibold p-0 w-[70]'}
                onChangeText={handleSearch}
                value={searchQuery}
              />
            </View>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              ListEmptyComponent={() => (
                <Text className="text-sm text-center text-[#888] mt-5">
                  No results found.
                </Text>
              )}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default LocationFilterModal;
