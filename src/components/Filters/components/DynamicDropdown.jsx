import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Icons} from '../../../assets/icons';

const DynamicDropdown = ({
  options,
  selectedValue,
  placeholder,
  onSelect,
  multiple = false,
  selectedValues = [],
}) => {
  const [visible, setVisible] = useState(false);

  if (options.length === 0) return null;

  const getDisplayValue = () => {
    if (multiple && selectedValues?.length > 0) {
      return selectedValues
        .map(val => options.find(opt => opt.value === val)?.label || val)
        .join(', ');
    }

    if (!multiple && typeof selectedValue === 'string') {
      return (
        options.find(opt => opt.value === selectedValue)?.label || selectedValue
      );
    }

    return placeholder;
  };

  const handleSelect = option => {
    onSelect(option);
    if (!multiple) setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        className="flex-row items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-2"
        onPress={() => setVisible(true)}>
        <Text className="text-gray-700 mr-2" numberOfLines={1}>
          {getDisplayValue()}
        </Text>
        <Icons.ChevronDown height={16} width={16} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <Pressable
          className="flex-1 bg-black/30 justify-center px-6"
          onPressOut={() => setVisible(false)}>
          <View className="bg-white rounded-2xl max-h-[60%] p-4">
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => {
                const isSelected = multiple
                  ? selectedValues?.includes(item.value)
                  : selectedValue === item.value;

                return (
                  <TouchableOpacity
                    className={`py-3 px-2 rounded-lg flex-row items-center justify-between',
                      isSelected && 'bg-gray-100`}
                    onPress={() => handleSelect(item)}>
                    <Text className="text-base text-gray-800">
                      {item.label}
                    </Text>
                    {/* {isSelected && <Check size={18} color="#4B5563" />} */}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default DynamicDropdown;
