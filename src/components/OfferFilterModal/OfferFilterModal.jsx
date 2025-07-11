import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import {
  SORT_OPTIONS,
  QUICK_FOLLOWER_OPTIONS,
  QUICK_OFFER_OPTIONS,
  QUICK_CITY_OPTIONS,
  cityOptions,
  categoryOptions,
} from '../Filters/filterOptions';
import Counter from '../Counter/Counter';
import PercentageSlider from '../Slider/Slider';
import IOSSwitch from '../common/Switch';

const OfferFilterModal = ({
  open,
  onClose,
  setFilterParams,
  selectedCategory,
}) => {
  const [filters, setFilters] = useState({
    allowedGuests: 0,
    minFollowers: 0,
    maxFollowers: 0,
    offerPercentage: 0,
    hasFastApproval: false,
    isNegotiable: false,
    autoRequestApproval: false,
    state: null,
    categories: [],
    sortBy: SORT_OPTIONS[0].value,
  });

  const [isStatePicker, setIsStatePicker] = useState(false);

  const getCategoryOptionsKey = category => {
    switch (category) {
      case 'RESORTS':
        return 'hotel';
      case 'RESTAURANTS':
        return 'restaurant';
      case 'SALONS':
        return 'salon';
      default:
        return 'hotel';
    }
  };

  const categoryKey = getCategoryOptionsKey(selectedCategory);

  const updateFilter = (key, value) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.allowedGuests > 0) count++;
    if (filters.minFollowers > 0 || filters.maxFollowers > 0) count++;
    if (filters.offerPercentage > 0) count++;
    if (filters.hasFastApproval) count++;
    if (filters.isNegotiable) count++;
    if (filters.autoRequestApproval) count++;
    if (filters.state) count++;
    if (filters.categories.length > 0) count++;
    if (filters.sortBy !== SORT_OPTIONS[0].value) count++;
    return count;
  }, [filters]);

  const applyFilters = () => {
    const finalFilters = {...filters};
    if (finalFilters.state) finalFilters.state = finalFilters.state.value;

    setFilterParams(finalFilters);
    onClose();
  };

  const clearAllFilters = () => {
    setFilters({
      allowedGuests: 0,
      minFollowers: 0,
      maxFollowers: 0,
      offerPercentage: 0,
      hasFastApproval: false,
      isNegotiable: false,
      autoRequestApproval: false,
      state: null,
      categories: [],
      sortBy: SORT_OPTIONS[0].value,
    });
    setFilterParams({});
    onClose();
  };

  const renderQuickSelectRow = (
    options,
    currentValue,
    onSelect,
    isRange = false,
  ) => (
    <View className="flex-row gap-4 mt-5">
      {options.map(opt => {
        const isSelected = isRange
          ? currentValue >= opt.value
          : currentValue === opt.value;

        return (
          <TouchableOpacity
            key={opt.value}
            className={`items-center justify-center w-[80px] h-[70px] rounded-2xl ${
              isSelected
                ? 'border-2 border-[#0033e6] bg-[#f5f7fa]'
                : 'border border-[#c2c8dc] bg-white'
            }`}
            onPress={() => onSelect(opt.value)}>
            <Text
              className={`mt-1 text-[14px] font-semibold ${
                isSelected ? 'text-[#0033e6]' : 'text-[#d5daeb]'
              }`}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (!open) return null;
  return (
    <Modal visible={open} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-[#F8F8F8]  rounded-t-3xl max-h-[60%]">
          <View className="bg-white flex-row justify-between  rounded-t-3xl p-5 border-[#c2c8dc] border-b">
            <Text className="text-xl font-semibold ">Filter</Text>
            <Text className="text-gray-600" onPress={onClose}>
              Close
            </Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort By */}
            <Text className="text-[#000f47] text-[16px] font-semibold mb-4 px-5 pt-4">
              Sort By
            </Text>
            <View className="flex flex-col gap-2 self-stretch rounded-md border border-[#c2c8dc] bg-white  py-4 mb-4 mx-5">
              {SORT_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  className="flex-row justify-between h-10 px-6 text-[12px] font-semibold text-[#23272e]"
                  onPress={() => updateFilter('sortBy', opt.value)}>
                  <Text
                    className={`p-2 ${
                      filters.sortBy === opt.value
                        ? 'text-blue-600 font-semibold'
                        : 'text-black'
                    }`}>
                    {opt.label}
                  </Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      filters.sortBy === opt.value
                        ? 'border-blue-600'
                        : 'border-gray-400'
                    } items-center justify-center`}>
                    {filters.sortBy === opt.value && (
                      <View className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View className="h-4 bg-white" />

            {/* Followers Range */}
            <View className="m-5">
              <Text className="font-semibold text-[16px]">Follower Range</Text>
              <View className="flex-row items-center justify-between gap-4 flex-1 mt-3">
                <View className="flex-[0.5]">
                  <Text className="text-[12px] font-medium mb-1 color-[#23272e]">
                    Minimum Range
                  </Text>
                  <TextInput
                    className={`border rounded-md px-3 py-3 mb-1 bg-white border-gray-300`}
                    keyboardType="numeric"
                    placeholder="Min Followers"
                    value={filters.minFollowers.toString()}
                    onChangeText={text =>
                      updateFilter('maxFollowers', Number(text))
                    }
                  />
                </View>
                <Text className="text-[14px] text-[#b0b4c1] font-semibold bg-[#f5f7fa] rounded-lg px-[10px] py-[2px] border border-[#e3e6ef]">
                  To
                </Text>

                <View className="flex-[0.5]">
                  <Text className="text-[12px] font-medium mb-1 color-[#23272e]">
                    Maximum Range
                  </Text>
                  <TextInput
                    className={`border rounded-md px-3 py-3 mb-1 bg-white border-gray-300`}
                    placeholder="Max Followers"
                    keyboardType="numeric"
                    value={filters.maxFollowers.toString()}
                    onChangeText={text =>
                      updateFilter('maxFollowers', Number(text))
                    }
                  />
                </View>
              </View>

              {renderQuickSelectRow(
                QUICK_FOLLOWER_OPTIONS,
                filters.minFollowers,
                value => updateFilter('minFollowers', value),
              )}
            </View>

            <View className="h-4 bg-white" />

            {/* Allowed Guests */}
            <View className="m-5">
              <Text className="font-semibold text-[16px] mb-2">
                Min Allowed Guest
              </Text>
              <Counter
                initialValue={filters.allowedGuests}
                onChange={val => updateFilter('allowedGuests', val)}
              />
            </View>

            <View className="h-4 bg-white" />

            {/* Offer Slider */}
            <View className="m-5">
              <Text className="font-semibold text-[16px]">Offer %</Text>
              <PercentageSlider
                value={filters.offerPercentage}
                onChange={val => updateFilter('offerPercentage', val)}
              />
              {renderQuickSelectRow(
                QUICK_OFFER_OPTIONS,
                filters.offerPercentage,
                value => updateFilter('offerPercentage', value),
              )}
            </View>

            <View className="h-4 bg-white" />

            {/* State Picker */}
            <View className="m-5">
              <Text className="font-semibold text-[16px]">State</Text>
              {/* <DropDownPicker
                open={isStatePicker}
                setOpen={setIsStatePicker}
                placeholder="Select a state"
                placeholderStyle={{color: '#9EA0A4'}}
                items={cityOptions}
                value={filters.state?.value}
                containerStyle={{height: 40}}
                dropDownContainerStyle={{backgroundColor: '#f5f7fa'}}
                onChangeItem={item => updateFilter('state', item)}
              
              /> */}
              {/* 

              {/*  <Picker
              selectedValue={filters.state?.value || ''}
              onValueChange={value => {
                const selected = cityOptions.find(opt => opt.value === value);
                updateFilter('state', selected || null);
              }}>
              <Picker.Item label="Select a State" value="" />
              {cityOptions.map(c => (
                <Picker.Item key={c.value} label={c.label} value={c.value} />
              ))}
            </Picker> */}
              {renderQuickSelectRow(
                QUICK_CITY_OPTIONS,
                filters.state?.value,
                val => updateFilter('state', {label: val, value: val}),
              )}
            </View>

            <View className="h-4 bg-white" />

            {/* Categories */}
            <View className="m-5">
              <Text className="font-semibold text-[16px]">Categories</Text>
              <View className="flex-row flex-wrap">
                {categoryOptions[categoryKey].map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    className={`px-3 py-2 rounded-lg m-1 ${
                      filters.categories.includes(opt.value)
                        ? 'bg-blue-700'
                        : 'bg-gray-200'
                    }`}
                    onPress={() => {
                      const newCategories = filters.categories.includes(
                        opt.value,
                      )
                        ? filters.categories.filter(c => c !== opt.value)
                        : [...filters.categories, opt.value];
                      updateFilter('categories', newCategories);
                    }}>
                    <Text
                      className={`text-sm ${
                        filters.categories.includes(opt.value)
                          ? 'text-white'
                          : 'text-black'
                      }`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="h-4 bg-white" />

            {/* Toggles */}
            <View className="m-5">
              {[
                ['Fast Approval', 'hasFastApproval'],
                ['Negotiable', 'isNegotiable'],
                ['Auto Request Approval', 'autoRequestApproval'],
              ].map(([label, key]) => (
                <View
                  key={key}
                  className="flex-row justify-between items-center mb-3">
                  <Text>{label}</Text>
                  <IOSSwitch
                    value={filters[key]}
                    onValueChange={val => updateFilter(key, val)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}

          <View className="bg-white flex-row justify-between p-5 border-[#c2c8dc] border-t mb-5 gap-5">
            <TouchableOpacity
              onPress={clearAllFilters}
              disabled={activeFilterCount === 0}
              className="bg-gray-300 p-3 rounded-lg flex-1">
              <Text className="text-center">Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={applyFilters}
              className="bg-blue-700 p-3 rounded-lg flex-1">
              <Text className="text-white text-center">
                Apply Filters{' '}
                {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OfferFilterModal;
