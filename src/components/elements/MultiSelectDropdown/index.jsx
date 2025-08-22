import {useCallback, useMemo, useRef, useState} from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icons } from '../../../assets/icons';
import InputField from '../Input';

const {width} = Dimensions.get('window');

const MultiSelectDropdown = ({
  data = [],
  placeholder = 'Select items...',
  onSelectionChange,
  searchPlaceholder = 'Search or add new item...',
  maxHeight = 300,
  selectedOptions,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState(selectedOptions);
  const searchInputRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    return data.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [data, searchText]);

  const handleSearch = text => {
    setSearchText(text);
  };

  const handleItemSelect = useCallback(
    item => {
      const isSelected = selectedItems.some(
        selected => selected.value === item.value,
      );
      const newSelection = isSelected
        ? selectedItems.filter(selected => selected.value !== item.value)
        : [...selectedItems, item];

      setSelectedItems(newSelection);
      onSelectionChange?.(newSelection);
    },
    [selectedItems, onSelectionChange],
  );

  const handleDone = useCallback(() => {
    if (
      searchText.trim() &&
      !data.some(
        item => item.label.toLowerCase() === searchText.trim().toLowerCase(),
      )
    ) {
      const newItem = {
        label: searchText.trim(),
        value: searchText.trim().toLowerCase().replace(/\s+/g, '_'),
      };

      const isAlreadySelected = selectedItems.some(
        item => item.value === newItem.value,
      );
      if (!isAlreadySelected) {
        const newSelection = [...selectedItems, newItem];
        setSelectedItems(newSelection);
        onSelectionChange?.(newSelection);
      }
    }

    setSearchText('');
    setIsVisible(false);
  }, [data, searchText, selectedItems, onSelectionChange]);

  const removeSelectedItem = useCallback(
    itemToRemove => {
      const newSelection = selectedItems.filter(
        item => item.value !== itemToRemove.value,
      );
      setSelectedItems(newSelection);
      onSelectionChange?.(newSelection);
    },
    [selectedItems, onSelectionChange],
  );

  const openDropdown = useCallback(() => {
    setIsVisible(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const renderDropdownItem = useCallback(
    ({item}) => {
      const isSelected = selectedItems.some(
        selected => selected.value === item.value,
      );

      return (
        <TouchableOpacity
          className={`flex-row items-center justify-between px-4 py-3 border-b border-gray-100 ${
            isSelected ? 'bg-blue-50' : ''
          }`}
          onPress={() => handleItemSelect(item)}>
          <Text
            className={`text-base flex-1 ${
              isSelected ? 'text-blue-500 font-medium' : 'text-gray-800'
            }`}>
            {item.label}
          </Text>
          {isSelected && (
            <Text className="text-blue-500 text-lg font-bold">✓</Text>
          )}
        </TouchableOpacity>
      );
    },
    [selectedItems, handleItemSelect],
  );

  return (
    <View className="my-2.5">
      <TouchableOpacity
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 bg-white ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
        onPress={openDropdown}>
        <Text
        numberOfLines={1}
          className={`text-base flex-1 ${
            selectedItems.length === 0 ? 'text-gray-400' : 'text-gray-800'
          }`}>
          {selectedItems.length > 0
            ? `${selectedItems.length} item(s) selected`
            : placeholder}
        </Text>
        <Icons.ChevronDown width={20} height={20} fill={'text-gray-500'}/>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-sm mt-2">{error}</Text>}

      {selectedItems.length > 0 && (
        <View className="mt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row">
            {selectedItems.map((item, index) => (
              <View
                key={`${item.value}-${index}`}
                className="flex-row items-center bg-blue-600 rounded-2xl px-3 py-1.5 mr-2"
                style={{maxWidth: width * 0.4}}>
                <Text
                  className="text-white text-sm font-medium mr-1.5"
                  numberOfLines={1}>
                  {item.label}
                </Text>
                <TouchableOpacity
                  className="bg-white rounded-full w-5 h-5 items-center justify-center"
                  onPress={() => removeSelectedItem(item)}>
                  <Icons.CrossIcon width={10} height={10} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}>
          <View
            className="bg-white rounded-xl shadow-lg"
            style={{
              width: width * 0.9,
              maxHeight: '70%',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}>
            <View className=" w-full border-b border-gray-200 px-4 py-3">
              <InputField
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchText}
                onChangeText={handleSearch}
                autoCapitalize="none"
                style={{padding: 8, width: '100%'}}
              />
            </View>

            <FlatList
              data={filteredData}
              renderItem={renderDropdownItem}
              keyExtractor={(item, index) => `${item.value}-${index}`}
              style={{maxHeight}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View className="p-5 items-center">
                  <Text className="text-base text-gray-500 text-center">
                    {searchText.trim()
                      ? `Press "Done" to add "${searchText.trim()}"`
                      : 'No items found'}
                  </Text>
                </View>
              )}
            />
            <View className="border-t border-gray-200 px-4 py-3">
              <TouchableOpacity
                className="bg-blue-500 px-4 py-3 rounded-md items-center"
                onPress={handleDone}>
                <Text className="text-white font-semibold text-base">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MultiSelectDropdown;
