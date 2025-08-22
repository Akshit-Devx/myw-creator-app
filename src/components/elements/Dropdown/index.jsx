import React from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  placeholder = '',
  onChangeValue,
  multiple,
}) => {
  return (
    <View className="">
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        style={{borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8}}
        dropDownContainerStyle={{
          borderColor: '#e5e7eb',
          borderWidth: 1,
          borderRadius: 8,
        }}
        textStyle={{color: '#000000e0'}}
        placeholderStyle={{color: '#9ca3af'}}
        className="w-full"
        onChangeValue={onChangeValue}
        {...(multiple && {multiple: true, mode: 'BADGE'})}
      />
    </View>
  );
};

export default Dropdown;
