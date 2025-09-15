import {View, Text, TouchableOpacity} from 'react-native';
import React, {memo, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import {updateCollaborationAPI} from '../../../services/handleApi';
import DateRangeInfo from '../../../screens/Campaigns/ApplyCampaign/VisitDateSelector/DateRangeInfo';
import CampaignBenefits from '../../../screens/Campaigns/CampaignDetails/AboutCampaign/CampaignBenefits';
import {
  IgPostSVG,
  IgReelSVG,
  IgStorySVG,
  YtVideoSVG,
} from '../../../utility/icons';
import {
  formatDate,
  getRequirementByFollowerCount,
} from '../../../utility/helper';

import DateChangeModal from '../../modals/DateChangeModal';
import CollabActionModal from '../../modals/CollabActionModal';

const DeliverablesListAndOffers = ({
  campaigns,
  status,
  offersAndDeliverables,
  icon,
  campaignDetails,
  setRefetchData,
}) => {
  const {onBoarding} = useSelector(state => state.onBoarding);

  const {instagramDetails} = onBoarding;
  const eligibleRequirements = useMemo(
    () =>
      getRequirementByFollowerCount(
        campaignDetails,
        campaignDetails?.requirements?.[0]?.platform || 'INSTAGRAM',
        instagramDetails?.followersCount,
      ),
    [campaignDetails, instagramDetails?.followersCount],
  );

  const offerings = useMemo(() => {
    if (campaigns?.status === 'REQUESTED') {
      return campaigns?.influencerOffer?.offerings;
    }
    if (campaigns?.status === 'NEGOTIATION') {
      return campaigns?.brandOffer?.offerings;
    }
    return campaigns?.acceptedOffer?.offerings;
  }, [campaigns]);

  const allowedGuests = useMemo(() => {
    if (campaigns?.status === 'REQUESTED') {
      return campaigns?.influencerOffer?.allowedGuests;
    }
    if (campaigns?.status === 'NEGOTIATION') {
      return campaigns?.brandOffer?.allowedGuests;
    }
    return campaigns?.acceptedOffer?.allowedGuests;
  }, [campaigns]);

  const currentStore = useMemo(() => {
    return (
      campaigns?.campaignDetails?.storesData.find(
        store => store.id === campaigns?.selectedStore,
      ) || null
    );
  }, [campaigns]);

  const requirements = campaigns?.campaignDetails?.requirements[0];
  const type = campaigns?.campaignDetails?.category;

  const [collabActionModal, setCollabActionModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateChangeModal, setDateChangeModal] = useState(false);

  const handleAcceptReject = async ({status}) => {
    setLoading(true);
    const payload = {
      status,
      id: campaigns.id,
      ...(status === 'AGREEMENT_ACCEPTED' && {
        acceptedOffer: offersAndDeliverables,
      }),
      timeLine: [
        ...(campaigns?.timeLine || []),
        {
          state: 'ACCEPTED',
          date: new Date().toISOString(),
        },
        {
          state: status,
          date: new Date().toISOString(),
        },
      ],
    };
    try {
      await updateCollaborationAPI(payload);
      setRefetchData();
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    const payload = {
      status: 'VISIT_WITHDRAWN',
      id: campaigns.id,
      timeLine: [
        ...(campaigns?.timeLine || []),
        {
          state: 'VISIT_WITHDRAWN',
          date: new Date().toISOString(),
        },
      ],
    };
    try {
      await updateCollaborationAPI(payload);
      setRefetchData();
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async data => {
    setLoading(true);
    try {
      const payload = {
        id: campaigns.id,
        brandId: campaigns?.brandId,
        campaignCategory: campaigns?.campaignDetails?.category,
        selectedDate: data.selectedDate || campaigns?.selectedDate,
        selectedTime: data.selectedTime || campaigns?.selectedTime,
        dateChangeRequested: true,
        source: 'INFLUENCER',
        ...(data.selectedDate && {
          scheduleHistory: [
            ...(campaigns?.scheduleHistory || []),
            {
              selectedDate: campaigns.selectedDate || null,
              selectedTime: campaigns.selectedTime || null,
              source: 'INFLUENCER',
              date: new Date().toISOString(),
            },
          ],
        }),
      };
      await updateCollaborationAPI(payload);
      setRefetchData();
      setDateChangeModal(false);
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="rounded-xl flex-col gap-4">
      <View className="flex-col gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            {icon}
            <Text className="text-lg text-neutral-800 font-medium">
              {status}
            </Text>
          </View>
          {formatDate(campaigns?.selectedDate) >
            formatDate(new Date().toISOString()) && (
            <TouchableOpacity
              onPress={() => setCollabActionModal(true)}
              className="flex-row items-center gap-2">
              <View className="w-5 h-5">
                <Icons.ThreeDotMenuIcon />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {type === 'RESORTS' ? (
          campaigns?.dateChangeRequested && campaigns?.source === 'BRAND' ? (
            <View className="flex-col gap-2 w-full mt-2">
              <Text className="text-sm font-normal text-[#333]">
                Rescheduled date
              </Text>

              <DateRangeInfo
                checkIn={campaigns?.selectedDate}
                checkOut={
                  campaigns?.selectedDate
                    ? new Date(
                        new Date(campaigns.selectedDate).getTime() +
                          (requirements?.creatorType?.[0]?.stayDuration?.days ||
                            0) *
                            86400000,
                      ).toISOString()
                    : null
                }
                selectedTime={campaigns?.selectedTime}
                type={type}
              />
            </View>
          ) : (
            <DateRangeInfo
              checkIn={campaigns?.selectedDate}
              checkOut={
                campaigns?.selectedDate
                  ? new Date(
                      new Date(campaigns.selectedDate).getTime() +
                        (requirements?.creatorType?.[0]?.stayDuration?.days ||
                          0) *
                          86400000,
                    ).toISOString()
                  : null
              }
              selectedTime={campaigns?.selectedTime}
              type={type}
            />
          )
        ) : campaigns?.dateChangeRequested && campaigns?.source === 'BRAND' ? (
          <View className="flex-col gap-2 w-full mt-2">
            <Text className="text-sm font-normal text-[#333]">
              Rescheduled date
            </Text>
            <DateRangeInfo
              checkIn={campaigns?.selectedDate}
              checkOut={
                campaigns?.selectedDate
                  ? new Date(
                      new Date(campaigns.selectedDate).getTime() +
                        (requirements?.creatorType?.[0]?.stayDuration?.days ||
                          0) *
                          86400000,
                    ).toISOString()
                  : null
              }
              selectedTime={campaigns?.selectedTime}
              type={type}
            />
          </View>
        ) : (
          <DateRangeInfo
            checkIn={campaigns?.selectedDate}
            checkOut={
              campaigns?.selectedDate
                ? new Date(
                    new Date(campaigns.selectedDate).getTime() +
                      (requirements?.creatorType?.[0]?.stayDuration?.days ||
                        0) *
                        86400000,
                  ).toISOString()
                : null
            }
            selectedTime={campaigns?.selectedTime}
            type={type}
          />
        )}
      </View>
      <View className="flex-col gap-2">
        <CampaignBenefits
          benefits={eligibleRequirements}
          category={campaignDetails?.category}
          offerings={offerings}
          allowedGuests={allowedGuests}
        />
        <View className="flex-col gap-2 p-3">
          <Text className="text-xl font-semibold text-neutral-800">
            Deliverables
          </Text>
          <Text className="text-md font-medium text-gray-500">
            Things you have to deliver post acceptance
          </Text>
        </View>
        {!!offersAndDeliverables?.reels && (
          <View className="flex-row items-center gap-2 w-full justify-between">
            <View className="flex-row items-center gap-3">
              <IgReelSVG size={24} />
              <Text className="text-lg font-medium text-[#333333]">Reels</Text>
            </View>
            <Text className="text-md font-medium text-[#0033e6e6] px-3 py-2 bg-[#f2f3f7] rounded-lg">
              {offersAndDeliverables?.reels}
            </Text>
          </View>
        )}
        {!!offersAndDeliverables?.posts && (
          <View className="flex-row items-center gap-2 w-full justify-between">
            <View className="flex-row items-center gap-3">
              <IgPostSVG />
              <Text className="text-lg font-medium text-[#333333]">Posts</Text>
            </View>
            <Text className="text-md font-medium text-[#0033e6e6] px-3 py-2 bg-[#f2f3f7] rounded-lg">
              {offersAndDeliverables?.posts}
            </Text>
          </View>
        )}
        {!!offersAndDeliverables?.stories && (
          <View className="flex-row items-center gap-2 w-full justify-between">
            <View className="flex-row items-center gap-3">
              <IgStorySVG />
              <Text className="text-lg font-medium text-[#333333]">
                Stories
              </Text>
            </View>
            <Text className="text-md font-medium text-[#0033e6e6] px-3 py-2 bg-[#f2f3f7] rounded-lg">
              {offersAndDeliverables?.stories}
            </Text>
          </View>
        )}
        {!!offersAndDeliverables?.videos && (
          <View className="flex-row items-center gap-2 w-full justify-between">
            <View className="flex-row items-center gap-3">
              <YtVideoSVG />
              <Text className="text-lg font-medium text-[#333333]">Videos</Text>
            </View>
            <Text className="text-md font-medium text-[#0033e6e6] px-3 py-2 bg-[#f2f3f7] rounded-lg">
              {offersAndDeliverables?.videos}
            </Text>
          </View>
        )}
        {!!offersAndDeliverables?.shorts && (
          <View className="flex-row items-center gap-2 w-full justify-between">
            <View className="flex-row items-center gap-3">
              <Icons.ShortsIcon width={24} height={24} />
              <Text className="text-lg font-medium text-[#333333]">Shorts</Text>
            </View>
            <Text className="text-md font-medium text-[#0033e6e6] px-3 py-2 bg-[#f2f3f7] rounded-lg">
              {offersAndDeliverables?.shorts}
            </Text>
          </View>
        )}
      </View>
      <View>
        {campaigns?.status === 'REJECTED' && (
          <View className="flex-row items-center gap-2">
            <Button onPress={() => {}} title="Explore More Campaigns" />
          </View>
        )}

        {campaigns?.status === 'NEGOTIATION' && (
          <View className="flex-row items-center gap-2 justify-between">
            <Button
              loading={loading}
              title="Accept"
              onPress={() => {
                handleAcceptReject({status: 'AGREEMENT_ACCEPTED'});
              }}
            />
            <Button
              loading={loading}
              title="Reject"
              onPress={() => {
                handleAcceptReject({status: 'REJECTED'});
              }}
            />
          </View>
        )}
      </View>
      <CollabActionModal
        visible={collabActionModal}
        handleClose={() => setCollabActionModal(false)}
        onWithdraw={() => {
          setCollabActionModal(false);
          handleWithdraw();
        }}
        onDateChange={() => {
          setCollabActionModal(false);
          setTimeout(() => {
            setDateChangeModal(true);
          }, 400);
        }}
      />
      <DateChangeModal
        onClose={() => {setDateChangeModal(false)}}
        visible={dateChangeModal}
        data={campaigns}
        currentStore={currentStore}
        onSubmit={handleDateChange}
      />
    </View>
  );
};

export default memo(DeliverablesListAndOffers);
