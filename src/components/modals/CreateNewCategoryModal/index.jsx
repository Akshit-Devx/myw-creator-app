import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {categoryList} from '../../../utility/common';
import Dropdown from '../../elements/Dropdown';
import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';

const CreateNewCategoryModal = ({visible, onClose, handleSubmit}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const handleClose = useCallback(() => {
    setValue(null);
    setOpen(false);
    onClose();
  }, [onClose]);
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View
        onPress={handleClose}
        className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <View className="flex-col gap-4">
            <View className="w-full flex-col gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-700 text-lg font-medium">
                  Your Category
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Icons.CrossIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
              <Dropdown
                open={open}
                value={value}
                items={categoryList?.map(i => {
                  return {
                    value: i,
                    label: i,
                  };
                })}
                setOpen={setOpen}
                setValue={setValue}
                onChangeValue={selectedValue =>
                  console.log('value', selectedValue)
                }
              />
            </View>
            <Button
              title="Create Category"
              disabled={!value}
              onPress={() => handleSubmit(value)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateNewCategoryModal;
