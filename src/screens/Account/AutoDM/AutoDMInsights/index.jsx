import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../../components/common/FullScreenLoader';
import {
  getInstagramDMByInfluencerIdAPI,
  updateInstagramDMAPI,
} from '../../../../services/handleApi';
import {formatNumber, getMediaURL} from '../../../../utility/helper';

const AutoDMInsightsScreen = () => {
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [loading, setLoading] = useState(false);
  const [instagramDM, setInstagramDM] = useState([]);
  const [totalDM, setTotalDM] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchInstagramDM();
    }, [fetchInstagramDM]),
  );

  const fetchInstagramDM = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInstagramDMByInfluencerIdAPI(onBoarding?.id);
      setInstagramDM(response);

      const totalComments = response.reduce((total, reel) => {
        return total + (reel.commentsList ? reel.commentsList.length : 0);
      }, 0);

      setTotalDM(totalComments);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [onBoarding?.id]);

  const handleToggle = async reel => {
    try {
      const updatedReelList = instagramDM.map(item =>
        item.id === reel.id ? {...item, isActive: !item.isActive} : item,
      );
      setInstagramDM(updatedReelList);

      const payload = {
        id: reel?.id,
        reelId: reel?.reelId,
        isActive: !reel?.isActive,
      };
      await updateInstagramDMAPI(payload);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-white">
      {loading && <FullScreenLoader visible={loading} />}

      <View className="flex-col gap-5 bg-white p-5">
        <View className="flex-col gap-1 bg-blue-950 p-5 rounded-xl">
          <Text className="text-white text-lg">Total Messages Sent</Text>
          <Text className="text-white text-2xl font-medium">{totalDM}</Text>
        </View>
        <View className="flex-col gap-2">
          <Text className="text-xl font-medium">Activate Posts</Text>
          <View className="flex-row gap-3 bg-gray-200 justify-between py-2 px-4 rounded-md">
            <Text>Reels</Text>
            <Text>DM's Sent</Text>
            <Text>Status</Text>
          </View>
          {!instagramDM?.length && (
            <View className="flex-col justify-center items-center gap-1 py-10 rounded-md border border-gray-200">
              <Text className="text-lg font-medium">No active post found</Text>
            </View>
          )}
          {!!instagramDM?.length &&
            instagramDM?.map((item, index) => (
              <View
                key={index}
                className="flex-row gap-3 items-center justify-between py-2 px-4 rounded-md border border-gray-200 ">
                <Image
                  source={{uri: getMediaURL(item?.thumbnailUrl)}}
                  className="w-24 h-36 rounded-md"
                />

                <View className="flex-col gap-1 items-center">
                  <Text className="text-xl font-medium">
                    {formatNumber(item?.commentsList?.length || 0)}
                  </Text>
                  <Text className="text-gray-600">{item?.cardType}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleToggle(item)}
                  className="flex-row border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                  <Text
                    className={`text-gray-600 px-2 py-2 rounded-md ${
                      !item?.isActive ? 'bg-red-500 text-white' : ''
                    }`}>
                    Off
                  </Text>
                  <Text
                    className={`text-gray-600 px-2 py-2 rounded-md ${
                      item?.isActive ? 'bg-green-500 text-white' : ''
                    }`}>
                    On
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default AutoDMInsightsScreen;
