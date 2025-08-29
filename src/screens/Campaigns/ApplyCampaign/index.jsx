import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

import {ServicesSVG} from '../../../utility/icons';
import VisitDateSelector from './VisitDateSelector';
import InputField from '../../../components/elements/Input';
import Checkbox from '../../../components/elements/Checkbox';
import DetailStackHeader from '../../../components/common/DetailStackHeader';
import CampaignDeliverables from '../CampaignDetails/AboutCampaign/CampaignDeliverables';
import {
  generateUUIDv4,
  convertTo12HourFormat,
  getRequirementByFollowerCount,
} from '../../../utility/helper';
import {
  getPublishedCampaign,
  updateCollaborationAPI,
  getCollaborationByIdAPI,
  updateSuggestionListDataAPI,
  checkInfluencerApplyEligibilityAPI,
} from '../../../services/handleApi';
import {
  REFS,
  MESSAGES,
  STATUSES,
  PLATFORMS,
  CAMPAIGN_TYPES,
} from '../../../utility/common';

const useCampaignOffers = eligibleRequirements => {
  const [campaignOffers, setCampaignOffers] = useState({
    reels: 0,
    shorts: 0,
    posts: 0,
    stories: 0,
    videos: 0,
    allowedGuests: 0,
  });

  const [campaignNegotiationOffers, setCampaignNegotiationOffers] = useState({
    reels: 0,
    shorts: 0,
    posts: 0,
    stories: 0,
    videos: 0,
    allowedGuests: 0,
  });

  useEffect(() => {
    if (eligibleRequirements) {
      const initialOffers = {
        reels: eligibleRequirements?.deliverables?.reels || 0,
        shorts: eligibleRequirements?.deliverables?.shorts || 0,
        posts: eligibleRequirements?.deliverables?.posts || 0,
        stories: eligibleRequirements?.deliverables?.stories || 0,
        videos: eligibleRequirements?.deliverables?.videos || 0,
        allowedGuests: eligibleRequirements?.allowedGuests || 0,
      };

      setCampaignOffers(initialOffers);
      setCampaignNegotiationOffers(initialOffers);
    }
  }, [eligibleRequirements]);

  const handleNegotiationChange = useCallback((field, value) => {
    setCampaignNegotiationOffers(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    campaignOffers,
    campaignNegotiationOffers,
    handleNegotiationChange,
  };
};

const useCampaignEligibility = (campaign, onBoardingId) => {
  const [eligibilityData, setEligibilityData] = useState({
    isApplied: false,
    isFromSuggestion: false,
    isFromInviteLink: false,
    isFromSuggestionRef: false,
    isFromInviteLinkRef: false,
    collabId: null,
    isFirstCollab: false,
  });

  const [loading, setLoading] = useState(false);

  const checkEligibility = useCallback(async () => {
    if (!campaign?.id) {
      return;
    }

    setLoading(true);
    try {
      const checkEligibilityRes = await checkInfluencerApplyEligibilityAPI({
        influencerId: onBoardingId,
        campaignId: campaign.id,
        campaignType: campaign.type.toUpperCase(),
      });

      if (checkEligibilityRes?.code !== 'SUCCESS') {
        return;
      }

      setEligibilityData({
        isApplied: checkEligibilityRes.message === MESSAGES.ALREADY_APPLIED,
        isFromSuggestion:
          checkEligibilityRes.message === MESSAGES.ELIGIBLE_FROM_SUGGESTION,
        isFromInviteLink:
          checkEligibilityRes.message === MESSAGES.ELIGIBLE_FROM_INVITATION,
        isFromSuggestionRef: checkEligibilityRes.ref === REFS.SUGGESTIONS,
        isFromInviteLinkRef: checkEligibilityRes.ref === REFS.INVITE_LINK,
        collabId: checkEligibilityRes.collaborationId,
        isFirstCollab: checkEligibilityRes.isFirstCollab,
      });
    } catch (error) {
      console.error('Error checking eligibility:', error);
    } finally {
      setLoading(false);
    }
  }, [campaign, onBoardingId]);

  return {
    ...eligibilityData,
    loading,
    checkEligibility,
  };
};

const ApplyCampaignScreen = ({navigation}) => {
  const route = useRoute();
  const {campaignId, storeId} = route.params;
  const {onBoarding} = useSelector(state => state.onBoarding);

  const {campaignOffers, campaignNegotiationOffers, handleNegotiationChange} =
    useCampaignOffers(eligibleRequirements);

  const {
    isApplied,
    isFromSuggestion,
    isFromInviteLink,
    collabId,
    isFirstCollab,
    loading,
    checkEligibility,
  } = useCampaignEligibility(campaign, onBoarding.id);

  const [campaign, setCampaign] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [specificInstructions, setSpecificInstructions] = useState('');
  const [hotelVisitDates, setHotelVisitDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [wantToCounter, setWantToCounter] = useState(false);
  const [collabDetails, setCollabDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {instagramDetails, instagramInsights} = onBoarding;

  const invitationData = {};
  const invitationDataObj = invitationData ? invitationData : null;

  const selectedStore = useMemo(
    () =>
      campaign?.storesData?.find(store => store.id === storeId) ||
      campaign?.storesData?.[0],
    [campaign?.storesData, storeId],
  );

  const eligibleRequirements = useMemo(
    () =>
      getRequirementByFollowerCount(
        campaign,
        campaign?.requirements?.[0]?.platform || PLATFORMS.INSTAGRAM,
        instagramDetails?.followersCount,
      ),
    [campaign, instagramDetails?.followersCount],
  );

  const campaignType = useMemo(
    () => campaign?.category || 'RESTAURANTS',
    [campaign?.category],
  );

  const isSalonCampaign = useMemo(
    () => campaign?.category === 'SALONS',
    [campaign?.category],
  );

  const isProductCampaign = useMemo(
    () => campaign?.category === 'PRODUCTS',
    [campaign?.category],
  );

  const isApplyButtonEnabled = useMemo(() => {
    if (
      (isSalonCampaign || isProductCampaign) &&
      selectedServices.length === 0
    ) {
      return false;
    }

    if (campaign?.category === 'RESORTS') {
      return !!hotelVisitDates;
    }

    if (isSalonCampaign) {
      return (
        selectedServices.length > 0 && !!(selectedDate && selectedTimeSlot)
      );
    }

    if (isProductCampaign) {
      return selectedServices.length > 0;
    }

    return !!(selectedDate && selectedTimeSlot);
  }, [
    isSalonCampaign,
    isProductCampaign,
    selectedServices,
    selectedDate,
    hotelVisitDates,
    campaign?.category,
    selectedTimeSlot,
  ]);

  const fetchCampaign = useCallback(async () => {
    try {
      // const response = await getCampaignByIdAPI(campaignId);
      const response = await getPublishedCampaign({
        id: campaignId,
        revalidate: 86400,
        tags: ['campaign-data', `campaign-${campaignId}`],
      });
      setCampaign(response);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [campaignId]);

  const getCollaborationByCampaignId = useCallback(async () => {
    try {
      const response = await getCollaborationByIdAPI(collabId || '');
      setCollabDetails(response);
    } catch (error) {
      console.error('Error fetching collaboration:', error);
    }
  }, [collabId]);

  const handleServiceToggle = useCallback(
    service => {
      setSelectedServices(prev => {
        if (prev.includes(service)) {
          return prev.filter(id => id !== service);
        }

        if (
          eligibleRequirements?.uptoLimit &&
          prev.length >= eligibleRequirements.uptoLimit
        ) {
          return prev;
        }

        return [...prev, service];
      });
    },
    [eligibleRequirements?.uptoLimit],
  );

  const handleDateSubmit = useCallback(
    data => {
      if (campaign?.category === CAMPAIGN_TYPES.RESORTS) {
        setHotelVisitDates(data);
      } else {
        setSelectedDate(data);
        if (data.selectedTimeSlot) {
          setSelectedTimeSlot(data.selectedTimeSlot);
        }
      }
    },
    [campaign?.category],
  );

  const createBasePayload = useCallback(
    influencerOffer => {
      const basePayload = {
        campaignId: campaign?.id,
        campaignCategory: campaign?.category,
        selectedStore: selectedStore?.id,
        isFirstCollab,
        influencerId: onBoarding?.id,
        brandId: campaign?.brandId,
        influencerOffer,
        influencerFollowersCount: instagramDetails?.followersCount,
        influencersCity: onBoarding?.city || '',
        influencersAvgViews: instagramInsights?.avgViews,
      };
      if (campaign?.category === CAMPAIGN_TYPES.RESORTS) {
        basePayload.selectedDate = hotelVisitDates?.selectedDate;
        basePayload.selectedTime = selectedStore?.availability?.[0]
          ? `${convertTo12HourFormat(
              selectedStore.availability[0].openTime,
            )} - ${convertTo12HourFormat(
              selectedStore.availability[0].closeTime,
            )}`
          : undefined;
      } else {
        basePayload.selectedDate = selectedDate?.selectedDate;
        basePayload.selectedTime = selectedTimeSlot || null;
      }
      return basePayload;
    },
    [
      campaign?.id,
      campaign?.category,
      campaign?.brandId,
      selectedStore?.id,
      selectedStore?.availability,
      isFirstCollab,
      onBoarding?.id,
      onBoarding?.city,
      instagramDetails?.followersCount,
      instagramInsights?.avgViews,
      hotelVisitDates?.selectedDate,
      selectedDate?.selectedDate,
      selectedTimeSlot,
    ],
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const influencerOffer = {
        ...(wantToCounter ? campaignNegotiationOffers : campaignOffers),
        offerPercentage: eligibleRequirements?.offerPercentage,
        isAmtLimit: eligibleRequirements?.isAmtLimit,
        uptoAmount: eligibleRequirements?.uptoAmount,
        autoRequestApproval: eligibleRequirements?.autoRequestApproval,
        autoDeliverablesApproval:
          eligibleRequirements?.autoDeliverablesApproval,
        offerings: isSalonCampaign
          ? selectedServices
          : eligibleRequirements?.offerings,
        stayDuration: eligibleRequirements?.stayDuration,
      };

      const payload = {
        ...createBasePayload(influencerOffer),
        hasNegotiated: wantToCounter,
        message: {
          id: generateUUIDv4(),
          message: specificInstructions,
          sender: onBoarding?.id,
          sentAt: new Date().toISOString(),
        },
        status: eligibleRequirements?.autoRequestApproval
          ? STATUSES.ACCEPTED
          : STATUSES.REQUESTED,
        campaignType: campaign?.type,
        ...(eligibleRequirements?.autoRequestApproval && {
          acceptedOffer: influencerOffer,
        }),
        timeLine: [
          {
            state: STATUSES.REQUESTED,
            date: new Date().toISOString(),
          },
          eligibleRequirements?.autoRequestApproval && {
            state: STATUSES.ACCEPTED,
            date: new Date().toISOString(),
          },
        ].filter(Boolean),
      };

      const response = await updateCollaborationAPI(payload);
      if (response) {
        navigation.goBack();
      }
      return response;
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    wantToCounter,
    campaignNegotiationOffers,
    campaignOffers,
    eligibleRequirements,
    isSalonCampaign,
    selectedServices,
    createBasePayload,
    specificInstructions,
    onBoarding?.id,
    campaign?.type,
    navigation,
  ]);

  const handleRejectInvite = useCallback(async () => {
    try {
      const payload = {
        id: collabId,
        status: STATUSES.REJECTED,
        influencerFollowersCount: instagramDetails?.followersCount,
        influencersCity: onBoarding?.city || '',
        influencersAvgViews: instagramInsights?.avgViews,
        timeLine: [
          ...(collabDetails?.timeLine || []),
          {
            state: STATUSES.REJECTED,
            date: new Date().toISOString(),
          },
        ],
      };
      await updateCollaborationAPI(payload);
      if (invitationDataObj?.suggestionListId) {
        const res = await updateSuggestionListDataAPI({
          id: invitationDataObj?.suggestionListId,
          status: 'REJECTED_BY_INFLUENCER',
          timeLine: [
            ...(invitationDataObj?.suggestionListTimeLine || []),
            {
              state: 'REJECTED_BY_INFLUENCER',
              date: new Date().toISOString(),
            },
          ],
        });
        if (res?.code === 'SUCCESS') {
          navigation.goBack();
        }
      }
      await checkEligibility();
    } catch (error) {
      console.error('Error rejecting collaboration:', error);
    }
  }, [
    collabId,
    instagramDetails?.followersCount,
    onBoarding?.city,
    instagramInsights?.avgViews,
    collabDetails?.timeLine,
    invitationDataObj?.suggestionListId,
    invitationDataObj?.suggestionListTimeLine,
    checkEligibility,
    navigation,
  ]);

  const handleAcceptInvite = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const offerDetails = {
        allowedGuests: eligibleRequirements?.allowedGuests,
        reels: eligibleRequirements?.deliverables?.reels,
        shorts: eligibleRequirements?.deliverables?.shorts,
        posts: eligibleRequirements?.deliverables?.posts,
        stories: eligibleRequirements?.deliverables?.stories,
        offerPercentage: eligibleRequirements?.offerPercentage,
        isAmtLimit: eligibleRequirements?.isAmtLimit,
        uptoAmount: eligibleRequirements?.uptoAmount,
        autoRequestApproval: eligibleRequirements?.autoRequestApproval,
        autoDeliverablesApproval:
          eligibleRequirements?.autoDeliverablesApproval,
        offerings: eligibleRequirements?.offerings,
        stayDuration: eligibleRequirements?.stayDuration,
      };

      const payload = {
        ...createBasePayload(offerDetails),
        status: STATUSES.ACCEPTED,
        acceptedOffer: offerDetails,
        timeLine: [
          ...(collabDetails?.timeLine || []),
          {
            state: STATUSES.REQUESTED,
            date: new Date().toISOString(),
          },
          {
            state: STATUSES.ACCEPTED,
            date: new Date().toISOString(),
          },
        ],
      };

      const response = await updateCollaborationAPI(payload);
      if (invitationDataObj?.suggestionListId) {
        const res = await updateSuggestionListDataAPI({
          id: invitationDataObj?.suggestionListId,
          status: 'ACCEPTED',
          timeLine: [
            ...(invitationDataObj?.suggestionListTimeLine || []),
            {
              state: 'ACCEPTED',
              date: new Date().toISOString(),
            },
          ],
        });
        if (res?.code === 'SUCCESS') {
          navigation.goBack();
        }
      }
      return response;
    } catch (error) {
      console.error('Error accepting collaboration:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    navigation,
    eligibleRequirements?.allowedGuests,
    eligibleRequirements?.deliverables?.reels,
    eligibleRequirements?.deliverables?.shorts,
    eligibleRequirements?.deliverables?.posts,
    eligibleRequirements?.deliverables?.stories,
    eligibleRequirements?.offerPercentage,
    eligibleRequirements?.isAmtLimit,
    eligibleRequirements?.uptoAmount,
    eligibleRequirements?.autoRequestApproval,
    eligibleRequirements?.autoDeliverablesApproval,
    eligibleRequirements?.offerings,
    eligibleRequirements?.stayDuration,
    createBasePayload,
    collabDetails?.timeLine,
    invitationDataObj?.suggestionListId,
    invitationDataObj?.suggestionListTimeLine,
  ]);

  const handleApplyForFree = useCallback(
    async ({influencerOffer} = {}) => {
      try {
        setIsSubmitting(true);
        const offerDetails = influencerOffer || {
          allowedGuests: eligibleRequirements?.allowedGuests,
          reels: eligibleRequirements?.deliverables?.reels,
          shorts: eligibleRequirements?.deliverables?.shorts,
          posts: eligibleRequirements?.deliverables?.posts,
          stories: eligibleRequirements?.deliverables?.stories,
          offerPercentage: eligibleRequirements?.offerPercentage,
          isAmtLimit: eligibleRequirements?.isAmtLimit,
          uptoAmount: eligibleRequirements?.uptoAmount,
          autoRequestApproval: eligibleRequirements?.autoRequestApproval,
          autoDeliverablesApproval:
            eligibleRequirements?.autoDeliverablesApproval,
          offerings: eligibleRequirements?.offerings,
          stayDuration: eligibleRequirements?.stayDuration,
        };

        const payload = {
          ...createBasePayload(offerDetails),
          status: STATUSES.REQUESTED,
          acceptedOffer: offerDetails,
          timeLine: [
            ...(collabDetails?.timeLine || []),
            {
              state: STATUSES.REQUESTED,
              date: new Date().toISOString(),
            },
          ],
        };

        const response = await updateCollaborationAPI(payload);
        return response;
      } catch (error) {
        console.error('Error applying for free:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [eligibleRequirements, createBasePayload, collabDetails],
  );

  useEffect(() => {
    fetchCampaign();
  }, [campaignId, fetchCampaign]);

  useEffect(() => {
    if ((isFromSuggestion || isFromInviteLink) && collabId) {
      getCollaborationByCampaignId();
    }
  }, [
    collabId,
    isFromSuggestion,
    isFromInviteLink,
    getCollaborationByCampaignId,
  ]);

  const renderServiceSelection = useMemo(() => {
    if (!isSalonCampaign && !isProductCampaign) {
      return null;
    }
    return (
      <View className="border border-gray-200 rounded-lg p-3 flex-col gap-3">
        <View className="flex-row items-center gap-3">
          <ServicesSVG />
          <View className="flex-col">
            <Text className="text-[#121212] text-lg font-semibold">
              {isSalonCampaign ? 'Select Services' : 'Select Products'}
            </Text>
            <Text className="text-[#626262] text-md font-medium">
              {isSalonCampaign ? 'Salon Services' : 'Products'}{' '}
              {eligibleRequirements?.uptoLimit &&
                ` (Up to ${eligibleRequirements.uptoLimit})`}
            </Text>
          </View>
        </View>
        <View className="h-[1px] bg-gray-200 w-full" />
        <View className="flex-col gap-4">
          {eligibleRequirements?.offerings?.map(service => {
            const isSelected = selectedServices.includes(service);
            const isDisabled =
              !isSelected &&
              eligibleRequirements?.uptoLimit &&
              selectedServices.length >= eligibleRequirements.uptoLimit;

            return (
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-[#121212] text-lg flex-1 font-medium">
                  • {service.name}
                </Text>
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleServiceToggle(service)}
                  disabled={isDisabled}
                />
              </View>
            );
          })}
        </View>
        {eligibleRequirements?.uptoLimit &&
          selectedServices?.length >= eligibleRequirements?.uptoLimit && (
            <View className="bg-[#ffdcdc] p-3 rounded-lg">
              <Text className="text-[#f40408] text-md font-medium">
                Only {eligibleRequirements?.uptoLimit}{' '}
                {isSalonCampaign ? 'services' : 'products'} can be selected
              </Text>
            </View>
          )}
        <View>
          <InputField
            placeholder={
              campaignType === CAMPAIGN_TYPES.SALONS
                ? 'Enter services like hair service, nails etc.'
                : campaignType === CAMPAIGN_TYPES.RESTAURANTS
                ? 'Enter meals, drinks, allowed guests etc.'
                : campaignType === CAMPAIGN_TYPES.RESORTS
                ? 'Enter room type, breakfast etc.'
                : campaignType === CAMPAIGN_TYPES.PRODUCTS
                ? 'Enter sizes, colours, links etc.'
                : 'Enter any specific instructions here.'
            }
            value={specificInstructions}
            onChangeText={text => setSpecificInstructions(text)}
            containerClassName="mb-0"
          />
        </View>
      </View>
    );
  }, [
    campaignType,
    eligibleRequirements?.offerings,
    eligibleRequirements?.uptoLimit,
    handleServiceToggle,
    isProductCampaign,
    isSalonCampaign,
    selectedServices,
    specificInstructions,
  ]);

  const renderBottomButtons = useMemo(() => {
    if (isApplied || isFromSuggestion || isFromInviteLink) return null;

    return (
      <View className="w-full bg-transparent flex justify-center">
        <TouchableOpacity
          className={`flex-row items-center justify-center ${
            isApplyButtonEnabled ? 'bg-blue-800' : 'bg-gray-400'
          } rounded-full p-4 w-full`}
          onPress={handleSubmit}
          disabled={!isApplyButtonEnabled || isSubmitting}>
          <Text
            className={`text-base ${
              isApplyButtonEnabled ? 'text-white' : 'text-white'
            } font-medium`}>
            Apply Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    isApplied,
    isFromSuggestion,
    isFromInviteLink,
    isApplyButtonEnabled,
    handleSubmit,
    isSubmitting,
  ]);

  const renderSuggestionButtons = useMemo(() => {
    if (!isFromSuggestion || isFromInviteLink) return null;

    return (
      <View className="w-full max-w-md bg-white px-2.5 pb-2.5 flex-row justify-center gap-4">
        <TouchableOpacity
          disabled={isSubmitting}
          className="flex-row items-center justify-center border border-gray-600 bg-white rounded-full p-4 w-1/2"
          onPress={handleRejectInvite}>
          <Text className="text-base font-medium text-gray-600">Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isSubmitting}
          className="flex-row items-center justify-center bg-blue-800 rounded-full p-4 w-1/2"
          onPress={handleAcceptInvite}>
          <Text className="text-base font-medium text-white">Accept</Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    isFromSuggestion,
    isFromInviteLink,
    handleRejectInvite,
    handleAcceptInvite,
    isSubmitting,
  ]);

  const renderInviteButton = useMemo(() => {
    if (!isFromInviteLink) return null;

    return (
      <View className="w-full bg-white px-2.5 pb-2.5 flex-row justify-center">
        <TouchableOpacity
          disabled={isSubmitting}
          className="flex-row items-center justify-center bg-blue-800 rounded-full p-4 w-full"
          onPress={handleApplyForFree}>
          <Text className="text-base font-medium text-white">
            Apply for free
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [isFromInviteLink, handleApplyForFree, isSubmitting]);

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Apply For Campaign"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <KeyboardAvoidingView
        className="grow"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView className="grow" showsVerticalScrollIndicator={false}>
          <View className="flex-1 p-5 flex-col gap-5">
            {renderServiceSelection}

            {!isProductCampaign && (
              <VisitDateSelector
                availability={selectedStore?.availability}
                type={campaign?.category}
                stayDuration={eligibleRequirements?.stayDuration}
                onSubmit={handleDateSubmit}
              />
            )}
            <View className="border border-gray-200 rounded-lg p-3 flex-col gap-2">
              <Text
                numberOfLines={1}
                className="text-lg font-semibold text-[#121212]">
                Apply for Campaign
              </Text>
              <CampaignDeliverables
                data={eligibleRequirements}
                platform={
                  campaign?.requirements?.[0]?.platform || PLATFORMS.INSTAGRAM
                }
                isNegotiable={
                  campaign?.requirements?.[0]?.isNegotiable || false
                }
                wantToCounter={wantToCounter}
                campaignNegotiationOffers={campaignNegotiationOffers}
                onNegotiationChange={handleNegotiationChange}
                type={campaign?.category}
              />
              {campaign?.requirements?.[0]?.isNegotiable && (
                <View className="flex-row items-center justify-between bg-[#f4f6ff] p-3 rounded-lg">
                  <Text className="text-lg font-semibold">
                    Want to Counter?
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className={`border py-2 px-4 rounded-lg bg-white font-medium ${
                        !wantToCounter ? 'border-[#0025e6]' : 'border-[#e0e0e0]'
                      }`}
                      onPress={() => setWantToCounter(false)}>
                      <Text
                        className={`text-md font-medium ${
                          !wantToCounter ? 'text-[#0025e6]' : 'text-[#666]'
                        }`}>
                        No
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`border py-2 px-4 rounded-lg bg-white font-medium ${
                        wantToCounter ? 'border-[#0025e6]' : 'border-[#e0e0e0]'
                      }`}
                      onPress={() => setWantToCounter(true)}>
                      <Text
                        className={`text-md font-medium ${
                          wantToCounter ? 'text-[#0025e6]' : 'text-[#666]'
                        }`}>
                        Yes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            {!isSalonCampaign && !isProductCampaign && (
              <View>
                <InputField
                  placeholder={
                    campaignType === 'SALONS'
                      ? 'Enter services like hair service, nails etc.'
                      : campaignType === 'RESTAURANTS'
                      ? 'Enter meals, drinks, allowed guests etc.'
                      : campaignType === 'RESORTS'
                      ? 'Enter room type, breakfast etc.'
                      : campaignType === 'PRODUCTS'
                      ? 'Enter sizes, colours, links etc.'
                      : 'Enter any specific instructions here.'
                  }
                  value={specificInstructions}
                  onChangeText={text => setSpecificInstructions(text)}
                  containerClassName="mb-0"
                />
              </View>
            )}
            {renderBottomButtons}
            {renderSuggestionButtons}
            {renderInviteButton}
          </View>
          <View className="h-[100]" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ApplyCampaignScreen;
