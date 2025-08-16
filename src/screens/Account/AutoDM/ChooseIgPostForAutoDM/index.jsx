import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import Button from '../../../../components/elements/Button';
import Checkbox from '../../../../components/elements/Checkbox';
import {getInstagramMedia} from '../../../../services/externalApi';
import {getInstagramDMByGSIAPI} from '../../../../services/handleApi';
import FullScreenLoader from '../../../../components/common/FullScreenLoader';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';

const {width} = Dimensions.get('window');

const ITEM_MARGIN = 7;
const ITEM_WIDTH = (width - (ITEM_MARGIN * 4 + 32)) / 3;

const ChooseIgPostForAutoDMScreen = () => {
  const navigation = useNavigation();

  const {onBoarding} = useSelector(state => state.onBoarding);
  const [reelsList, setReelsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchInstagramMedia();
  }, []);

  const fetchInstagramMedia = async () => {
    try {
      setLoading(true);
      const reels = await getInstagramMedia(
        onBoarding?.instagramToken?.refreshToken,
      );
      setReelsList(reels);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPressNext = useCallback(async () => {
    try {
      if (!selectedPost?.id) {
        return;
      }
      const response = await getInstagramDMByGSIAPI({
        reelId: selectedPost?.id,
      });
      const existingReel = response?.find(i => i.reelId === selectedPost?.id);
      if (existingReel) {
        navigation.navigate('CardDetails', {
          reel: {...selectedPost, cardType: existingReel?.cardType},
          details: existingReel,
        });
      } else {
        navigation.navigate('SelectCardType', {reel: selectedPost});
      }
    } catch (error) {
      console.error('error onPressNext', error);
    }
  }, [navigation, selectedPost]);

  const renderItem = ({item, index}) => {
    const isSelected = item.id === selectedPost?.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedPost(item);
        }}
        className={`h-[154] rounded-lg border-2 overflow-hidden ${
          isSelected ? 'border-blue-500' : 'border-white'
        }`}
        style={{width: ITEM_WIDTH}}
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

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Choose Post For Auto DM"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="flex-1 flex-col gap-5 bg-white p-5">
        {loading && <FullScreenLoader visible={loading} />}

        <FlatList
          data={reelsList}
          renderItem={renderItem}
          contentContainerStyle={{flexGrow: 1, gap: 14}}
          columnWrapperStyle={{gap: 14}}
          numColumns={3}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          showsVerticalScrollIndicator={false}
        />
        <Button
          onPress={onPressNext}
          title="Next"
          variant="primary"
          disabled={!selectedPost?.id}
        />
      </View>
    </View>
  );
};

export default ChooseIgPostForAutoDMScreen;
