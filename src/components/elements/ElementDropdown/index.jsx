import {View, StyleSheet} from 'react-native';
import React from 'react';

import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

const ElementDropdown = ({
  data,
  onChange,
  style,
  containerStyle,
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  iconStyle,
  search,
  maxHeight,
  fontFamily,
  iconColor,
  activeColor,
  placeholder,
  searchPlaceholder,
  value,
  labelField,
  valueField,
  disable,
  autoScroll,
  showsVerticalScrollIndicator,
  dropdownPosition,
  flatListProps,
  renderLeftIcon,
  renderRightIcon,
  renderItem,
  onFocus,
  onBlur,
  searchQuery,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <RNEDropdown
        style={[styles.dropdown, style]}
        containerStyle={containerStyle}
        placeholderStyle={placeholderStyle}
        selectedTextStyle={selectedTextStyle}
        inputSearchStyle={inputSearchStyle}
        iconStyle={iconStyle}
        data={data}
        search={search}
        maxHeight={maxHeight}
        fontFamily={fontFamily}
        iconColor={iconColor}
        activeColor={activeColor}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        labelField={labelField || 'label'}
        valueField={valueField || 'value'}
        disable={disable}
        autoScroll={autoScroll}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        dropdownPosition={dropdownPosition}
        flatListProps={flatListProps}
        renderLeftIcon={renderLeftIcon}
        renderRightIcon={renderRightIcon}
        renderItem={renderItem}
        onFocus={onFocus}
        onBlur={onBlur}
        searchQuery={searchQuery}
        onChange={item => {
          if (onChange) {
            onChange(item);
          }
        }}
        {...rest}
      />
    </View>
  );
};

export default ElementDropdown;

const styles = StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: 10,
    },
    dropdown: {
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 8,
    },
  });