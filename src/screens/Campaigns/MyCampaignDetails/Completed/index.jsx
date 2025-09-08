import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {GIFs} from '../../../../assets/gif';
import {PNGs} from '../../../../assets/png';
import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import {FeedbackSVG, StarSVG} from '../../../../utility/icons';
import StarRating from '../../../../components/common/StarRating';
import {
  updateCollabRatingAPI,
  getCollabRatingsByGSIAPI,
} from '../../../../services/handleApi';

const Completed = ({onBoarding, collab, setRefetchData, campaignDetails}) => {
  const navigation = useNavigation();
  const [showConfetti, setShowConfetti] = useState(
    !!collab?.ratings?.ratingToBrand,
  );
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [rating, setRating] = useState(collab?.ratings?.ratingToBrand || 5);
  const [feedback, setFeedback] = useState(
    collab?.ratings?.reviewToBrand || '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(
    !collab?.ratings?.ratingToBrand,
  );
  const [reviews, setReviews] = useState([]);
  const [cardExpanded, setCardExpanded] = useState({
    steps: false,
  });

  const ProfileImg = useMemo(
    () =>
      onBoarding?.profilePictureWithoutBg
        ? {uri: getMediaURL(onBoarding.profilePictureWithoutBg)}
        : PNGs.DummyBanner,
    [onBoarding?.profilePictureWithoutBg],
  );

  const handleRatingChange = newRating => {
    setRating(newRating);
  };

  const submitFeedback = async () => {
    if (rating === 0) return;

    try {
      setIsSubmitting(true);

      const feedbackData = {
        ...collab?.ratings,
        collaborationId: collab?.id,
        brandId: collab?.brandId,
        campaignId: collab?.campaignId,
        influencerId: collab?.influencerId,
        ratingToBrand: rating,
        reviewToBrand: feedback,
        influencerRatedAt: new Date().toISOString(),
      };

      const response = await updateCollabRatingAPI(feedbackData);

      setFeedbackModal(true);

      setTimeout(() => {
        setFeedbackModal(false);
      }, 3000);

      setRefetchData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchReviews = useCallback(async () => {
    try {
      const res = await getCollabRatingsByGSIAPI({
        influencerId: onBoarding.id,
      });
      const filteredReviews = res.filter(
        review => review.brandId === collab?.brandId,
      );
      setReviews(filteredReviews || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  }, [onBoarding.id, collab?.brandId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFeedbackDone(!collab?.ratings?.ratingToBrand);
  }, [collab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarSVG
          key={i}
          color={i <= Math.round(rating) ? '#F90' : '#E0E0E0'}
          size="16"
        />,
      );
    }
    return stars;
  };

  return (
    <View className="flex-col gap-4 mt-4">
      {!campaignDetails?.activateAutoDm && (
        <View>
          {feedbackDone && (
            <View className="relative flex-col gap-4">
              {showConfetti && (
                <Image
                  source={GIFs.Confetti}
                  resizeMode="contain"
                  className="absolute top-0 left-0 z-0"
                />
              )}
              <View className="z-10 flex-col gap-3 justify-center items-center">
                <Image
                  source={ProfileImg}
                  className="w-[70] h-[70] rounded-full"
                />
                <View className="flex-col gap-1 justify-center items-center">
                  <Text className="text-[#2a2a2a] text-lg font-semibold">
                    Congratulations! {onBoarding?.name}
                  </Text>
                  <Text className="text-[#2a2a2a] text-xs font-normal">
                    Your campaign is completed
                  </Text>
                </View>
              </View>
              <View className="justify-center items-center">
                <StarRating
                  totalStars={5}
                  initialRating={0}
                  onRate={handleRatingChange}
                />
              </View>
              <View className={styles.shareExperienceContainer}>
                <InputField
                  multiline
                  label={'Share your Experience'}
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Write your experience here"
                  containerClassName="min-h-[100px]"
                  labelClassName="text-[#626262] text-lg font-semibold"
                />
              </View>
              <Button
                title="Share Response"
                onPress={submitFeedback}
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </View>
          )}
        </View>
      )}

      {feedbackDone && (
        <View className="flex-col gap-4">
          <View className="flex-row gap-4 items-center">
            <Image source={ProfileImg} className="w-[70] h-[70] rounded-full" />

            <Text className="text-[#2a2a2a] text-xl font-semibold">
              My Review
            </Text>
          </View>
          <Text className="text-[#2a2a2a] text-xl font-semibold">
            {rating}
            <StarRating
              totalStars={5}
              initialRating={rating}
              readOnly
              size={18}
            />
          </Text>
          <Text className={styles.feedbackDescription}>{feedback}</Text>
          <Button
            title="Explore campaigns"
            onPress={() => {
              // navigation.pop is not working here so I've used goBack two times
              navigation.goBack();
              navigation.goBack();
            }}
          />
        </View>
      )}

      {reviews.some(review => review?.ratingToInfluencer) && (
        <View className="flex-col gap-8">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center gap-4 justify-between"
            onPress={() =>
              setCardExpanded(prev => ({
                ...prev,
                steps: !prev.steps,
              }))
            }>
            <Text className="text-[#2a2a2a] text-xl font-semibold">
              Brand Reviews
            </Text>

            {cardExpanded.steps ? (
              <Icons.ChevronUp width={20} height={20} />
            ) : (
              <Icons.ChevronDown width={20} height={20} />
            )}
          </TouchableOpacity>
          <View className="flex-col gap-4">
            {cardExpanded.steps && reviews.length > 0 && (
              <View
                className="bg-white rounded-lg p-4"
                style={styles.reviewContainer}>
                <FlatList
                  data={reviews}
                  renderItem={({item}) => {
                    const review = item?.ratingToInfluencer;
                    if (!review) {
                      return;
                    }
                    const logo = item?.campaignDetails?.brandLogo
                      ? {uri: getMediaURL(item?.campaignDetails?.brandLogo)}
                      : PNGs.DummyBanner;
                    return (
                      <View key={review.id} className="py-2 flex-col gap-1">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row gap-4">
                            <Image
                              source={logo}
                              className="rounded-full w-[32] h-[32] bg-gray-400"
                            />
                            <View className="flex-col gap-1">
                              <Text>{item?.campaignDetails?.brandName}</Text>
                              {item?.brandRatedAt && (
                                <Text className="text-[#626262] text-xs font-normal">
                                  {new Date(
                                    item.brandRatedAt,
                                  ).toLocaleDateString()}
                                </Text>
                              )}
                            </View>
                          </View>

                          <View className="flex-row gap-2">
                            <Text className="text-[#2a2a2a] text-md font-semibold">
                              {item?.ratingToInfluencer?.toFixed(1)}
                            </Text>
                            <View className="flex-row gap-1">
                              {renderStars(item?.ratingToInfluencer)}
                            </View>
                          </View>
                        </View>

                        {item?.reviewToInfluencer && (
                          <Text
                            numberOfLines={5}
                            className="flex-1 text-[#333333] text-md font-normal">
                            {item?.reviewToInfluencer}
                          </Text>
                        )}
                      </View>
                    );
                  }}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="flex-col gap-4"
                  scrollEnabled={false}
                  ItemSeparatorComponent={
                    <View className="h-[1] bg-gray-200 my-1" />
                  }
                />
              </View>
            )}
          </View>
        </View>
      )}
      {feedbackModal && (
        <Modal
          visible={feedbackModal}
          transparent
          animationType="fade"
          onRequestClose={() => setFeedbackModal(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-4/5 justify-center items-center">
              <FeedbackSVG />
              <Text className="text-lg text-[#333] font-semibold mt-2">
                Your feedback has been saved
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Completed;

const styles = StyleSheet.create({
  reviewContainer: {
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
