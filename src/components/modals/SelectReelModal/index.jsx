import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import Checkbox from '../../elements/Checkbox';
import {getInstagramMedia} from '../../../services/externalApi';

const SelectReelModal = ({
  token,
  visible,
  onClose,
  handleSaveReel,
  handleConnectInstagram,
}) => {
  const [loader, setLoader] = useState(false);
  const [reelsList, setReelsList] = useState([]);
  const [selectedReels, setSelectedReels] = useState([]);

  const handleClose = useCallback(() => {
    setSelectedReels([]);
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

  const handleSelectReel = useCallback(item => {
    setSelectedReels(prev => {
      if (prev.includes(item)) {
        return prev.filter(reel => reel.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const renderItem = ({item, index}) => {
    const isSelected = selectedReels.includes(item);
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelectReel(item);
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
        <View className="absolute top-[8] right-[8]">
          <Checkbox checked={isSelected} onChange={() => {}} />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getAllReels();
  }, [getAllReels]);

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
              Select Reels
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Icons.CrossIcon />
            </TouchableOpacity>
          </View>
          <>
            {loader ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size={'large'} color={'blue'} />
                <Text className="text-xl text-gray-900 font-semibold">
                  Instagram Reels Loading...
                </Text>
              </View>
            ) : token ? (
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
                  title={'Add'}
                  className="my-5"
                  onPress={() => {
                    handleSaveReel(selectedReels);
                    handleClose();
                  }}
                />
              </View>
            ) : (
              <View className="flex flex-col gap-5 p-5 px-7 rounded-xl border border-dashed border-gray-200 mx-auto">
                <View className="flex flex-col justify-center items-center gap-4">
                  <Icons.IgAnalytics width={38} height={38} />
                  <View className="flex flex-col justify-center items-center gap-3 text-center">
                    <Text className="font-semibold text-xl">
                      Instagram Insights
                    </Text>
                    <Text className="text-xs text-center">
                      Connect your Instagram to see your insights here directly.
                    </Text>
                  </View>
                </View>
                <View className="items-center">
                  <TouchableOpacity
                    className="bg-blue-500 py-2 px-5 rounded-lg"
                    onPress={handleConnectInstagram}>
                    <Text className="text-white text-base font-medium text-center">
                      Connect Instagram
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        </View>
      </View>
    </Modal>
  );
};

export default SelectReelModal;
