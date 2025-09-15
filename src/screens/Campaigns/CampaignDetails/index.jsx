import {useCallback, useMemo, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import AboutCampaign from './AboutCampaign';
import Button from '../../../components/elements/Button';
import {CAMPAIGN_DETAILS_TABS} from '../../../utility/common';
import {fetchInfluencerById} from '../../../store/slices/onBoarding';
import ConnectIGModal from '../../../components/modals/ConnectIGModal';
import SubscribeModal from '../../../components/modals/SubscribeModal';
import FullScreenLoader from '../../../components/common/FullScreenLoader';
import DetailStackHeader from '../../../components/common/DetailStackHeader';
import PaymentSuccessModal from '../../../components/modals/PaymentSuccessModal';
import CampaignDetailModal from '../../../components/modals/CampaignDetailModal';
import NotEligibleModalContent from '../../../components/modals/CampaignDetailModal/NotEligibleModalContent';
import FollowerLimitModalContent from '../../../components/modals/CampaignDetailModal/FollowerLimitModalContent';
import MaxLimitReachedModalContent from '../../../components/modals/CampaignDetailModal/MaxLimitReachedModalContent';
import {
  getCampaignByIdAPI,
  getWhitelistByInfluencerIdAPI,
  checkInfluencerApplyEligibilityAPI,
} from '../../../services/handleApi';
import {
  getMediaURL,
  formatNumber,
  convertToTitleCase,
  getMediaTypeFromPath,
  checkSubscriptionStatus,
  getRequirementByFollowerCount,
} from '../../../utility/helper';
import {
  WEBSITE_URL,
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_LOGIN_SCOPES,
} from '../../../config/envConfig';

const CampaignPhotosSection = ({campaignData}) => {
  const storeMedia = campaignData?.storeData?.storeMedia;
  return (
    <View className="p-5">
      {!storeMedia?.length && (
        <Text className="text-indigo-600 text-lg text-center">
          No Photos Provided
        </Text>
      )}
      {!!storeMedia?.length && (
        <View className="flex-col gap-7">
          {storeMedia?.map((media, index) => (
            <View className="flex-col gap-3" key={index}>
              <Text className="text-xl font-semibold">{media?.name}</Text>
              <View className="flex-row flex-wrap gap-3">
                {media?.media?.map((item, itemIndex) => (
                  <Image
                    key={itemIndex}
                    source={{uri: getMediaURL(item)}}
                    className="w-[31%] h-44 rounded-lg mb-1 object-cover"
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const CampaignDetailsScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {campaignId, storeId} = route.params;
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {subscription} = useSelector(state => state.subscription);
  const isSubscribed = checkSubscriptionStatus(subscription);

  const {instagramDetails} = onBoarding;

  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState();
  const [selectedTab, setSelectedTab] = useState('ABOUT');
  const [isApplied, setIsApplied] = useState(false);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
  const [isDailyMaxLimitReached, setIsDailyMaxLimitReached] = useState(false);
  const [isFromSuggestion, setIsFromSuggestion] = useState(false);
  const [isFromInviteLink, setIsFromInviteLink] = useState(false);
  const [isFromSuggestionRef, setIsFromSuggestionRef] = useState(false);
  const [isFromInviteLinkRef, setIsFromInviteLinkRef] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isWhiteListed, setIsWhiteListed] = useState(false);
  const [collabId, setCollabId] = useState(null);
  const [modalState, setModalState] = useState({
    notEligibleModal: false,
    maxLimitReachedModal: false,
    dailyMaxLimitReachedModal: false,
    subscriptionModal: false,
    connectInstagramModal: false,
    connectYoutubeModal: false,
    followerLimitModal: false,
    shareModal: false,
    paymentSuccessModal: false,
    invitationAcceptedModal: false,
  });

  const eligibleRequirements = useMemo(
    () =>
      getRequirementByFollowerCount(
        campaignData,
        campaignData?.requirements?.[0]?.platform || 'INSTAGRAM',
        instagramDetails?.followersCount,
      ),
    [campaignData, instagramDetails?.followersCount],
  );

  const type = useMemo(
    () => campaignData?.category || 'RESTAURANTS',
    [campaignData?.category],
  );

  const platform = useMemo(
    () => campaignData?.requirements?.[0]?.platform || 'INSTAGRAM',
    [campaignData],
  );

  useFocusEffect(
    useCallback(() => {
      fetchCampaign();
      dispatch(fetchInfluencerById(onBoarding?.id));
    }, [campaignId, dispatch, onBoarding?.id]),
  );

  const handleModalState = useCallback((key, value) => {
    setModalState(prev => ({...prev, [key]: value}));
  }, []);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const whitelist = await getWhitelistByInfluencerIdAPI(onBoarding.id);
      if (whitelist?.length) {
        if (!!whitelist[0]?.id && !!whitelist[0]?.isActive)
          setIsWhiteListed(true);
      }

      const response = await getCampaignByIdAPI(campaignId);

      const matchingStore = (response?.storesData || []).find(
        store => store.id === storeId,
      );

      setSelectedStore(matchingStore);

      const transformedCampaign = matchingStore
        ? {...response, storeData: matchingStore}
        : null;
      const checkEligibility = await checkInfluencerApplyEligibilityAPI({
        influencerId: onBoarding.id,
        campaignId: campaignId,
        campaignType: transformedCampaign?.type,
      });

      if (checkEligibility?.code !== 'SUCCESS') {
        return;
      }

      setIsApplied(checkEligibility.message === 'ALREADY_APPLIED');
      setIsMaxLimitReached(
        checkEligibility.message === 'MAXIMUM_OPEN_COLLABORATIONS_REACHED',
      );
      setIsDailyMaxLimitReached(
        checkEligibility.message === 'MAXIMUM_DAILY_APPLIES_REACHED',
      );
      setIsFromSuggestion(
        checkEligibility.message === 'ELIGIBLE_FROM_SUGGESTION',
      );
      setIsFromInviteLink(
        checkEligibility.message === 'ELIGIBLE_FROM_INVITATION',
      );
      setIsFromSuggestionRef(checkEligibility.ref === 'SUGGESTIONS');
      setIsFromInviteLinkRef(checkEligibility.ref === 'INVITE_LINK');
      setCollabId(checkEligibility.collaborationId);
      setCampaignData(transformedCampaign);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBtn = useCallback(() => {
    try {
      if (!isSubscribed && !isFromSuggestion && !isFromInviteLink) {
        if (instagramDetails?.followersCount < 1000) {
          handleModalState('followerLimitModal', true);
          return;
        }

        if (!isWhiteListed) {
          handleModalState('subscriptionModal', true);
          return;
        }
      }

      if (
        platform === 'INSTAGRAM' &&
        !onBoarding?.allowInstagramSkip &&
        !onBoarding?.instagramToken?.refreshToken
      ) {
        handleModalState('connectInstagramModal', true);
        return;
      }

      if (platform === 'YOUTUBE' && !onBoarding?.youtubeToken?.refreshToken) {
        handleModalState('connectYoutubeModal', true);
        return;
      }

      if (isMaxLimitReached) {
        handleModalState('maxLimitReachedModal', true);
        return;
      }

      if (isDailyMaxLimitReached) {
        handleModalState('dailyMaxLimitReachedModal', true);
        return;
      }

      if (eligibleRequirements) {
        if (
          instagramDetails?.followersCount < eligibleRequirements?.minFollowers
        ) {
          handleModalState('notEligibleModal', true);
          return;
        }
      }

      navigation.navigate('Detail', {
        screen: 'ApplyCampaign',
        params: {
          campaignId: campaignData?.id,
          storeId: selectedStore?.id,
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }, [
    isSubscribed,
    isFromSuggestion,
    isFromInviteLink,
    platform,
    onBoarding?.allowInstagramSkip,
    onBoarding?.instagramToken?.refreshToken,
    onBoarding?.youtubeToken?.refreshToken,
    isMaxLimitReached,
    isDailyMaxLimitReached,
    eligibleRequirements,
    navigation,
    campaignData?.id,
    selectedStore?.id,
    instagramDetails?.followersCount,
    isWhiteListed,
    handleModalState,
  ]);

  const handleGoToCampaign = useCallback(() => {
    try {
      navigation.navigate('Detail', {
        screen: 'MyCampaignDetails',
        params: {
          collabId: collabId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }, [collabId, navigation]);

  const handleKnowMore = () => {
    try {
      handleModalState('subscribeModal', false);
      setTimeout(() => {
        navigation.navigate('Detail', {
          screen: 'Pricing',
        });
      }, 400);
    } catch (error) {
      console.error('Error: in handleKnowMore', error);
    }
  };

  const handleConnectToInstagram = () => {
    try {
      handleModalState('connectInstagramModal', false);
      setTimeout(() => {
        const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${WEBSITE_URL}/configure/instagram/&response_type=code&scope=${INSTAGRAM_LOGIN_SCOPES}`;
        navigation.navigate('Detail', {
          screen: 'InstagramConnect',
          params: {
            url,
          },
        });
      }, 400);
    } catch (error) {
      console.error('Error: in handleConnectToInstagram', error);
    }
  };

  const mediaType = getMediaTypeFromPath(campaignData?.banner);

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Details"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-1 flex-col gap-2">
          <View>
            {mediaType === 'video' ? (
              <Video
                source={{uri: getMediaURL(campaignData?.banner)}}
                style={{width: '100%', height: 300}}
                resizeMode="cover"
                repeat
                muted
                paused={false}
                controls={false}
                playInBackground={false}
                playWhenInactive={false}
              />
            ) : (
              <Image
                source={{uri: getMediaURL(campaignData?.banner)}}
                style={{width: '100%', height: 300, objectFit: 'cover'}}
              />
            )}
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20" />
          </View>

          <View
            style={styles.card}
            className="mt-[-60px] bg-white mx-8 rounded-lg overflow-hidden p-5 flex-col gap-4  border border-gray-200">
            {(isFromSuggestionRef ||
              isFromInviteLinkRef ||
              campaignData?.hasFastApproval) && (
              <View className="flex-row items-center gap-5">
                {(isFromSuggestionRef || isFromInviteLinkRef) && (
                  <View className="bg-[#f5f1ff] py-1 px-2 rounded-lg">
                    <Text className="text-[#651fff] text-md">Invited</Text>
                  </View>
                )}
                {campaignData?.hasFastApproval && (
                  <View className="bg-[#0000009e] rounded-lg px-2 py-1 self-start">
                    <Text className="text-white">Fast Approval</Text>
                  </View>
                )}
              </View>
            )}
            <View className="flex-row items-center gap-5">
              <Image
                source={{uri: getMediaURL(campaignData?.brandLogo)}}
                className="w-16 h-16 rounded-full"
              />
              <View className="flex-col gap-1">
                <Text className="text-2xl font-semibold w-60" numberOfLines={1}>
                  {campaignData?.storeData?.name}
                </Text>
                <Text className="text-md text-gray-500 w-60" numberOfLines={1}>
                  {campaignData?.storeData?.city},{' '}
                  {campaignData?.storeData?.state}
                </Text>
              </View>
            </View>
            <Text className="leading-2" numberOfLines={2}>
              {campaignData?.description}
            </Text>
            {campaignData?.category === 'RESORTS' &&
              campaignData?.storeData?.avgPrice && (
                <View>
                  <Text className="text-gray-500">Average Price</Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-semibold">
                      {campaignData?.storeData?.avgPrice}
                    </Text>
                    <Text className="text-gray-500">/night</Text>
                    <Text className="text-purple-600 bg-purple-100 border border-purple-600 rounded-md px-4 py-1 ml-4">
                      You Get it for free
                    </Text>
                  </View>
                </View>
              )}
          </View>

          <View className="flex-row items-center gap-5 px-5">
            {CAMPAIGN_DETAILS_TABS?.map(item => (
              <TouchableOpacity onPress={() => setSelectedTab(item)} key={item}>
                <Text
                  className={`${
                    selectedTab === item
                      ? 'text-blue-600 border-blue-600'
                      : 'text-black border-transparent'
                  } border-b text-lg px-5 py-2`}>
                  {convertToTitleCase(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedTab === 'ABOUT' && (
            <AboutCampaign
              campaignData={campaignData}
              followers={onBoarding?.instagramDetails?.followersCount || 0}
              data={eligibleRequirements}
              isApplied={isApplied}
              isNegotiable={campaignData?.requirements[0]?.isNegotiable}
              type={type}
              selectedStore={selectedStore}
            />
          )}
          {selectedTab === 'PHOTOS' && (
            <CampaignPhotosSection campaignData={campaignData} />
          )}
        </View>
      </ScrollView>
      {!isApplied && !isFromSuggestion && !isFromInviteLink && (
        <View className="px-5 py-2 border-t border-gray-200">
          <Button title="Apply Now" size="lg" onPress={handleApplyBtn} />
        </View>
      )}
      {isFromSuggestion && !isFromInviteLink && (
        <View className="px-5 py-2 border-t border-gray-200">
          <Button title="Review" size="lg" onPress={handleApplyBtn} />
        </View>
      )}

      {isFromInviteLink && (
        <View className="px-5 py-2 border-t border-gray-200">
          <Button title="Apply for free" size="lg" onPress={handleApplyBtn} />
        </View>
      )}

      {isApplied && (
        <View className="px-5 py-2 border-t border-gray-200">
          <Button
            title="Go to Campaign"
            size="lg"
            onPress={handleGoToCampaign}
          />
        </View>
      )}

      {modalState.followerLimitModal && (
        <CampaignDetailModal
          visible={modalState.followerLimitModal}
          onClose={() => {
            handleModalState('followerLimitModal', false);
          }}>
          <FollowerLimitModalContent
            handleSubscribeNow={() => {
              handleModalState('followerLimitModal', false);
              setTimeout(() => {
                navigation.navigate('Detail', {
                  screen: 'Pricing',
                });
              }, 400);
            }}
          />
        </CampaignDetailModal>
      )}

      {modalState.maxLimitReachedModal && (
        <CampaignDetailModal
          visible={modalState.maxLimitReachedModal}
          onClose={() => {
            handleModalState('maxLimitReachedModal', false);
          }}>
          <MaxLimitReachedModalContent
            title="Action Required"
            content="You must complete the deliverables for your previous campaigns before applying for new ones."
            handleClose={() => handleModalState('maxLimitReachedModal', false)}
          />
        </CampaignDetailModal>
      )}

      {modalState.notEligibleModal && (
        <CampaignDetailModal
          visible={modalState.notEligibleModal}
          onClose={() => {
            handleModalState('notEligibleModal', false);
          }}>
          <NotEligibleModalContent
            handleClose={() => {
              handleModalState('notEligibleModal', false);
            }}
            followers={formatNumber(
              Math.max(
                eligibleRequirements?.minFollowers -
                  instagramDetails?.followersCount,
                0,
              ),
            )}
          />
        </CampaignDetailModal>
      )}

      {modalState.dailyMaxLimitReachedModal && (
        <CampaignDetailModal
          visible={modalState.dailyMaxLimitReachedModal}
          onClose={() => {
            handleModalState('dailyMaxLimitReachedModal', false);
          }}>
          <MaxLimitReachedModalContent
            title="Action Required"
            content="You have reached your daily limit of applications. Please try again tomorrow."
            handleClose={() => {
              handleModalState('dailyMaxLimitReachedModal', false);
            }}
          />
        </CampaignDetailModal>
      )}

      <ConnectIGModal
        visible={modalState.connectInstagramModal}
        handleClose={() => handleModalState('connectInstagramModal', false)}
        handleConnectToInstagram={handleConnectToInstagram}
      />

      <SubscribeModal
        visible={!!modalState.subscriptionModal}
        onClose={() => handleModalState('subscriptionModal', false)}
        handleKnowMore={handleKnowMore}
        setPaymentSuccessModal={value => {
          handleModalState('paymentSuccessModal', value);
          fetchCampaign();
        }}
        setSubscriptionModal={value => {
          handleModalState('subscriptionModal', value);
        }}
      />

      {modalState.paymentSuccessModal && (
        <PaymentSuccessModal
          visible={modalState.paymentSuccessModal}
          onClose={() => handleModalState('paymentSuccessModal', false)}
          handleDone={() => handleModalState('paymentSuccessModal', false)}
        />
      )}

      <FullScreenLoader loading={loading} visible={loading} />
    </View>
  );
};

export default CampaignDetailsScreen;

const styles = StyleSheet.create({
  card: {
    shadowColor: '#1A1A1A1A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    backgroundColor: '#FFFFFF',
  },
});
