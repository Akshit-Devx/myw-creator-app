import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import Video from 'react-native-video';

import {StarSVG} from '../../../../utility/icons';
import {getMediaURL} from '../../../../utility/helper';
import {getCollabRatingsByGSIAPI} from '../../../../services/handleApi';
import MediaPreviewModal from '../../../../components/modals/MediaPreviewModal';

const ReviewsTab = ({influencerId}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [mediaPreviewVisible, setMediaPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [media, setMedia] = useState([]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getCollabRatingsByGSIAPI({influencerId});
      setReviews(res || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMediaGrid = useCallback(reviewId => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }, []);

  const getDisplayedMedia = useCallback(
    review => {
      const mediaLinks = review.deliverables?.uploadedLiveLinks || [];
      if (mediaLinks.length === 0) return [];

      if (expandedReviews[review.id] || mediaLinks.length <= 2) {
        return mediaLinks;
      }

      return [mediaLinks[0], mediaLinks[1], {type: 'SHOW_MORE'}];
    },
    [expandedReviews],
  );

  const handleMediaPreview = useCallback((media, index) => {
    setCurrentIndex(index);
    setMedia(media);
    setMediaPreviewVisible(true);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = useCallback(rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <View key={i} style={{width: 16, overflow: 'hidden'}}>
          <StarSVG
            color={i <= Math.round(rating) ? '#F90' : '#E0E0E0'}
            size={16}
          />
        </View>,
      );
    }
    return stars;
  }, []);

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 font-semibold text-lg">
            Loading reviews...
          </Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          scrollEnabled={false}
          renderItem={({item}) => {
            const uploadedLiveLinksLength =
              item.deliverables.uploadedLiveLinks?.length;
            return (
              <View className="py-5 border-b border-[#e2e5e9] flex-col gap-2">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-3">
                    <Image
                      source={{
                        uri: getMediaURL(
                          item?.campaignDetails?.brandLogo ||
                            '/default-logo.png',
                        ),
                      }}
                      className="w-[50] h-[50] rounded-full border border-[#e2e5e9]"
                    />
                    <View>
                      <Text className="text-gray-600 font-semibold text-lg">
                        {item?.campaignDetails?.brandName}
                      </Text>
                      <Text className="text-gray-400 font-semibold text-xs">
                        {new Date(item?.brandRatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-md text-gray-500 font-medium">
                      {item?.ratingToInfluencer?.toFixed(1)}
                    </Text>
                    <View className="flex-row">
                      {renderStars(item?.ratingToInfluencer)}
                    </View>
                  </View>
                </View>
                {item?.reviewToInfluencer ? (
                  <Text className="text-gray-600 font-semibold text-lg">
                    {item?.reviewToInfluencer}
                  </Text>
                ) : null}
                <View>
                  {item?.deliverables?.uploadedLiveLinks?.length > 0 ? (
                    <FlatList
                      data={getDisplayedMedia(item)}
                      renderItem={({item: mediaItem, index}) => {
                        if (mediaItem?.type === 'SHOW_MORE') {
                          return (
                            <TouchableOpacity
                              className="w-[62] h-[92] bg-[#e2e5e9] rounded-lg justify-center items-center mr-2"
                              onPress={() => toggleMediaGrid(item.id)}>
                              <Text className="text-gray-600 font-semibold text-xs">
                                +{uploadedLiveLinksLength - 2}
                              </Text>
                            </TouchableOpacity>
                          );
                        }

                        return (
                          <View className="mr-2" key={index}>
                            <TouchableOpacity
                              onPress={() =>
                                handleMediaPreview(
                                  item?.deliverables?.uploadedLiveLinks,
                                  index,
                                )
                              }>
                              {mediaItem.type === 'STORY' ||
                              mediaItem.type === 'REEL' ? (
                                <Video
                                  style={styles.video}
                                  source={{uri: getMediaURL(mediaItem.link)}}
                                  muted
                                  resizeMode="cover"
                                />
                              ) : (
                                <Image
                                  source={{uri: getMediaURL(mediaItem.link)}}
                                  className="w-[62] h-[92] bg-[#e2e5e9] rounded-lg"
                                  resizeMode="cover"
                                />
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(mediaItem, index) => `${item.id}-${index}`}
                    />
                  ) : null}
                </View>
              </View>
            );
          }}
          contentContainerStyle={{flexGrow: 1}}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-600 font-semibold text-lg">
                No reviews yet
              </Text>
            </View>
          )}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
        />
      )}

      <MediaPreviewModal
        visible={mediaPreviewVisible}
        onClose={() => {
          setMediaPreviewVisible(false);
          setMedia([]);
          setCurrentIndex(null);
        }}
        media={media}
        index={currentIndex}
      />
    </View>
  );
};

export default ReviewsTab;

const styles = StyleSheet.create({
  video: {
    width: 62,
    height: 92,
    backgroundColor: '#e2e5e9',
    borderRadius: 6,
    overflow: 'hidden',
  },
});
