import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {useFilters} from './hooks/useFilters';
import {Icons} from '../../assets/icons';
import {getCategoryFilterOptions} from './filterHelpers';
import DynamicDropdown from './components/DynamicDropdown';
import AppliedFilterBadge from '../AppliedFilterBadge/AppliedFilterBadge';
import NavigationTabs from '../../NavigationTabs/NavigationTabs';
import TagDropdown from '../common/Dropdown';
import CategoryDropdown from '../common/Dropdown';
// import {
//   AppliedFilterBadge,
//   DynamicDropdown,
//   NavigationTabs,
// } from './components';

const Filters = ({selectedIndex, setFilterModal, selectedCategory}) => {
  const {filterParams, updateQueryParams, getAppliedFilters} =
    useFilters(selectedIndex);
  const appliedFilters = getAppliedFilters();

  const {
    stateOptions = [],
    categoryOptions: dynamicCategoryOptions = [],
    followerRangeOptions = [],
  } = getCategoryFilterOptions(selectedCategory.toUpperCase());

  // Extract selected values
  const selectedCategories = Array.isArray(filterParams.categories)
    ? filterParams.categories
    : typeof filterParams.categories === 'string'
    ? filterParams.categories.split(',')
    : [];

  const selectedState = filterParams.state || undefined;

  let selectedFollowerRange = undefined;
  if (filterParams.minFollowers && filterParams.maxFollowers) {
    selectedFollowerRange = {
      minFollowers: Number(filterParams.minFollowers),
      maxFollowers: Number(filterParams.maxFollowers),
    };
  } else if (filterParams.minFollowers) {
    selectedFollowerRange = {
      minFollowers: Number(filterParams.minFollowers),
    };
  }

  // Event handlers
  const handleStateChange = option => {
    updateQueryParams({state: option.value || undefined});
  };

  const handleCategoryChange = option => {
    let newCategories = [...selectedCategories];
    if (newCategories.includes(option.value)) {
      newCategories = newCategories.filter(cat => cat !== option.value);
    } else {
      newCategories.push(option.value);
    }
    updateQueryParams({
      categories: newCategories.length ? newCategories.join(',') : undefined,
    });
  };

  const handleFollowerRangeChange = option => {
    const value = option.value;
    if (value?.minFollowers && value?.maxFollowers) {
      updateQueryParams({
        minFollowers: value.minFollowers.toString(),
        maxFollowers: value.maxFollowers.toString(),
      });
    } else if (value?.minFollowers) {
      updateQueryParams({
        minFollowers: value.minFollowers.toString(),
        maxFollowers: undefined,
      });
    } else {
      updateQueryParams({minFollowers: undefined, maxFollowers: undefined});
    }
  };

  const handleFilterRemove = filter => {
    const obj = {};
    filter.realKeys.forEach(key => (obj[key] = undefined));
    updateQueryParams(obj);
  };

  return (
    <View className="p-4 flex-row ">
      <View className="self-center gap-8">
        <TouchableOpacity
          className="rounded-lg px-2 py-2 bg-white border border-gray-200 active:bg-slate-50 active:border-slate-300 mr-3"
          onPress={() => setFilterModal(true)}>
          <Icons.FilterList width={20} height={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 8}}>
        {/* Applied Filter Badges */}
        <View className="flex-row items-center justify-center gap-2">
          {appliedFilters.map(filter => (
            <AppliedFilterBadge
              key={filter.realKeys.join('-')}
              filter={filter}
              onRemove={() => handleFilterRemove(filter)}
            />
          ))}
        </View>

        {/* State Dropdown */}
        <DynamicDropdown
          options={stateOptions}
          selectedValue={selectedState}
          placeholder="State"
          onSelect={handleStateChange}
        />

        {/* Category Dropdown */}
        <DynamicDropdown
          options={dynamicCategoryOptions}
          selectedValues={selectedCategories}
          placeholder="Categories"
          onSelect={handleCategoryChange}
          multiple
        />

        {/* Followers Dropdown */}
        <DynamicDropdown
          options={followerRangeOptions}
          placeholder="Followers"
          onSelect={handleFollowerRangeChange}
        />

        <NavigationTabs
          selectedIndex={selectedIndex}
          filterParams={filterParams}
          updateQueryParams={updateQueryParams}
        />
      </ScrollView>
    </View>
  );
};

export default Filters;
