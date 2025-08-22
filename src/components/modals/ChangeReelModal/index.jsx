import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import {getInstagramMedia} from '../../../services/externalApi';

const ChangeReelModal = ({visible, token, onClose, handleSaveReel}) => {
  const [loader, setLoader] = useState(false);
  const [reelsList, setReelsList] = useState([]);
  const [selectedReel, setSelectedReel] = useState(null);

  const handleClose = useCallback(() => {
    setSelectedReel(null);
    onClose();
  }, [onClose]);

  const getAllReels = useCallback(async () => {
    try {
      setLoader(true);
      const response = await getInstagramMedia(token);
      setReelsList(response || []);
    } catch (error) {
      console.error('Error: in getAllReels', error);
    } finally {
      setLoader(false);
    }
  }, [token]);

  useEffect(() => {
    getAllReels();
  }, [getAllReels]);

  const renderItem = ({item, index}) => {
    const isSelected = selectedReel?.id === item?.id;
    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelectedReel(null);
          } else {
            setSelectedReel(item);
          }
        }}
        className={`h-[154] w-[100] rounded-lg border-2 overflow-hidden ${
          isSelected ? 'border-blue-500' : 'border-white'
        }`}
        key={`${item.id}_${index}`}>
        <Image
          source={{uri: item?.thumbnail_url}}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50 p-5 w-full">
        <View className="bg-white p-2 rounded-lg flex-1 w-full">
          <View className="flex flex-row justify-between items-center py-3 px-2">
            <Text className="text-xl text-gray-900 font-semibold">
              Select a Reel
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icons.CrossIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <FlatList
              data={reelsList}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{gap: 10}}
              columnWrapperStyle={{gap: 10}}
              numColumns={3}
              ListFooterComponent={<View className="h-5" />}
              showsVerticalScrollIndicator={false}
            />

            <Button
              title={'Save Reel'}
              className="my-5"
              onPress={() => handleSaveReel(selectedReel)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChangeReelModal;
