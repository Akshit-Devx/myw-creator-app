import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import Video from 'react-native-video';
import {useFocusEffect} from '@react-navigation/native';

import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';
import {getInfluencerPortfolioByInfluencerIdAPI} from '../../../../services/handleApi';

const MyWorkTab = ({influencerId, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);

  const fetchPortfolio = useCallback(async () => {
    if (!influencerId) {
      return;
    }
    try {
      setLoading(true);
      const data = await getInfluencerPortfolioByInfluencerIdAPI(influencerId);
      setPortfolioData(data?.filter(item => !item.isArchived) || []);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, [influencerId]);

  useFocusEffect(
    useCallback(() => {
      fetchPortfolio();
    }, [fetchPortfolio]),
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600 font-semibold text-lg">
          Loading portfolio...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      <FlatList
        data={portfolioData}
        renderItem={({item}) => {
          return (
            <View className="flex-col gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-semibold text-gray-700">
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EditCategory', {categoryId: item.id})
                  }
                  className="bg-black/30 rounded-lg p-1">
                  <Icons.EditIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-2">
                {item?.tags?.map((tag, index) => {
                  return (
                    <View
                      key={index}
                      className="border-[#9c2cf3] border bg-[#f3e5ff] rounded-full py-1 px-3">
                      <Text className="text-[#9c2cf3]">{tag}</Text>
                    </View>
                  );
                })}
              </View>
              <FlatList
                data={item?.videos}
                renderItem={({item: video}) => {
                  return (
                    <View className="w-[150px] h-[200px] rounded-lg overflow-hidden relative">
                      <Video
                        source={{uri: getMediaURL(video?.videoUrl)}}
                        style={styles.video}
                        resizeMode="cover"
                        muted
                        repeat
                      />
                      <View className="bg-black/60 absolute bottom-[20] left-[10] right-[10] flex-row items-center gap-2 p-2 rounded-lg justify-between">
                        <View className="flex-row items-center gap-2">
                          <Icons.CommentWhiteIcon width={14} height={14} />
                          <Text className="text-white text-md font-medium">
                            {video?.insights?.comments}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Icons.LikeOutlineIcon width={14} height={14} />
                          <Text className="text-white text-md font-medium">
                            {video?.insights?.likes}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                removeClippedSubviews
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={30}
                contentContainerStyle={{gap: 12}}
                ListFooterComponent={
                  <TouchableOpacity className="w-[150px] h-[200px] rounded-lg bg-[#8cc8ff26] border border-[#248beb] border-dashed justify-center">
                    <Text className="text-[#248beb] text-center text-md font-semibold">
                      + Add Custom Link
                    </Text>
                  </TouchableOpacity>
                }
              />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        contentContainerStyle={{gap: 20}}
        scrollEnabled={false}
      />
    </View>
  );
};

export default MyWorkTab;

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
