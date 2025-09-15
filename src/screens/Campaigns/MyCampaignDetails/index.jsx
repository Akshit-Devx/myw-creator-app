import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  View,
  Linking,
  Platform,
  UIManager,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import {twMerge} from 'tailwind-merge';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';


import Completed from './Completed';
import {Icons} from '../../../assets/icons';
import VisitedStatus from './VisitedStatus';
import VisitWithdrawn from './VisitWithdrawn';
import AcceptedStatus from './AcceptedStatus';
import SubmitLiveLink from './SubmitLiveLink';
import NotVisitedStatus from './NotVisitedStatus';
import DeliverableAccepted from './DeliverableAccepted';
import DeliverablesRevision from './DeliverablesRevision';
import DeliverableSubmitted from './DeliverableSubmitted';
import ProductAcceptedStatus from './ProductAcceptedStatus';
import AboutCampaign from '../CampaignDetails/AboutCampaign';
import ProductAgreementStatus from './ProductAgreementStatus';
import AgreementAcceptedStatus from './AgreementAcceptedStatus';
import DateChangeRejectedStatus from './DateChangeRejectedStatus';
import MakePayment from '../../../components/sections/MakePayment';
import CustomStepper from '../../../components/common/CustomStepper';
import ExpandableText from '../../../components/common/ExpandableText';
import FullScreenLoader from '../../../components/common/FullScreenLoader';
import HotelsAgreementAcceptedStatus from './HotelsAgreementAcceptedStatus';
import DetailStackHeader from '../../../components/common/DetailStackHeader';
import ViewCampaignDetailsModal from '../../../components/modals/ViewCampaignDetailsModal';
import DeliverablesListAndOffers from '../../../components/MyCampaignDetails/DeliverablesListAndOffers';
import {
  getPublishedCampaign,
  getCollaborationByIdAPI,
} from '../../../services/handleApi';
import {
  stepsData,
  formatDate,
  getBrandMediaUrl,
  getRequirementByFollowerCount,
} from '../../../utility/helper';
import {Text} from 'react-native';
import {
  EmailSVG,
  WaitingSVG,
  RejectedSVG,
  LinkGlobeSVG,
} from '../../../utility/icons';

const CollaborationStatusTab = {
  TIMELINE: 'Timeline',
  ABOUT: 'About',
  // CHAT: "Chat",
};

export const CollaborationStatus = {
  ALL: 'ALL',
  REQUESTED: 'REQUESTED',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  NEGOTIATION: 'NEGOTIATION',
  AGREEMENT_ACCEPTED: 'AGREEMENT_ACCEPTED',
  VISITED: 'VISITED',
  BILL_PAID: 'BILL_PAID',
  DELIVERABLES_SUBMITTED: 'DELIVERABLES_SUBMITTED',
  DELIVERABLES_RESUBMITTED: 'DELIVERABLES_RESUBMITTED',
  DELIVERABLES_REJECTED: 'DELIVERABLES_REJECTED',
  DELIVERABLES_ACCEPTED: 'DELIVERABLES_ACCEPTED',
  DELIVERABLES_REVISION: 'DELIVERABLES_REVISION',
  LIVE_LINK: 'LIVE_LINK',
  COMPLETED: 'COMPLETED',
};

const campaignSteps = [
  {label: 'Approval', value: 'ACCEPTED'},
  {label: 'Scheduled', value: 'AGREEMENT_ACCEPTED'},
  {label: 'Visit Place', value: 'VISITED'},
  {label: 'Completed', value: 'LIVE_LINK'},
];

const productSteps = [
  {label: 'Approval', value: 'ACCEPTED'},
  {label: 'Dispatched', value: 'AGREEMENT_ACCEPTED'},
  {label: 'Delivered', value: 'VISITED'},
  {label: 'Completed', value: 'COMPLETED'},
];

const VIEWABLE_STATES = ['Request Sent', 'Negotiation', 'Accepted'];

const Tabs = ({activeTab, onTabChange, campaigns}) => {
  const tabs = Object.values(CollaborationStatusTab).filter(tab => {
    // if (tab === CollaborationStatusTab.CHAT) {
    //   return !["REQUESTED", "NEGOTIATION", "REJECTED"].includes(
    //     campaigns?.status
    //   );
    // }
    return true;
  });

  return (
    <View className="flex-row gap-5 items-center">
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          className={` p-4 border  rounded-lg ${
            activeTab === tab
              ? 'bg-[#e1e7ff] border-[#0033e6e6]'
              : 'border-gray-200'
          }`}
          onPress={() => onTabChange(tab)}>
          <Text
            className={`text-sm font-medium ${
              activeTab === tab ? 'text-[#0033e6]' : 'text-gray-500'
            }`}>
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const MyCampaignDetailsScreen = () => {
  const navigation = useNavigation();
  const {collabId} = useRoute().params;

  const {onBoarding} = useSelector(state => state.onBoarding);

  const [loading, setLoading] = useState(false);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [activeTab, setActiveTab] = useState(CollaborationStatusTab.TIMELINE);
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [viewType, setViewType] = useState('');
  const [refetchData, setRefetchData] = useState(false);

  const type = campaignDetails?.category || 'RESTAURANTS';

  const currentStep = (() => {
    if (
      [
        CollaborationStatus.VISITED,
        CollaborationStatus.BILL_PAID,
        CollaborationStatus.DELIVERABLES_SUBMITTED,
        CollaborationStatus.DELIVERABLES_RESUBMITTED,
        CollaborationStatus.DELIVERABLES_REJECTED,
        CollaborationStatus.DELIVERABLES_ACCEPTED,
        CollaborationStatus.DELIVERABLES_REVISION,
      ].includes(campaigns?.status)
    ) {
      return 'VISITED';
    }

    if (
      [CollaborationStatus.LIVE_LINK, CollaborationStatus.COMPLETED].includes(
        campaigns?.status,
      )
    ) {
      return 'LIVE_LINK';
    }

    return campaigns?.status;
  })();

  const {instagramDetails} = onBoarding;

  const eligibleRequirements = getRequirementByFollowerCount(
    campaignDetails,
    'INSTAGRAM',
    instagramDetails?.followersCount,
  );

  const getAllCampaigns = useCallback(async () => {
    setLoading(true);
    console.log('collabId', collabId);
    const data = await getCollaborationByIdAPI(collabId);
    console.log('data', data);
    setCampaigns(data);
    const response = await getPublishedCampaign({
      id: data?.campaignDetails?.id,
    });
    setCampaignDetails(response);
    setLoading(false);
  }, [collabId]);

  const handleView = type => {
    setViewType(type || '');
    setViewDetailsModal(true);
  };

  const handleExpandActions = () => {
    LayoutAnimation.easeInEaseOut();
    setIsActionsExpanded(!isActionsExpanded);
  };

  useEffect(() => {
    getAllCampaigns();
  }, [collabId, getAllCampaigns]);

  const renderContent = () => {
    if (activeTab === CollaborationStatusTab.TIMELINE) {
      const steps = stepsData(campaigns);
      const currentStep = campaigns?.timeLine?.length || 1;

      return (
        <View className="flex-col gap-4 px-2">
          <View className="border border-gray-200 p-5 rounded-lg">
            <View className="flex-col gap-2">
              <TouchableOpacity
                className="flex-row items-center gap-2 justify-between"
                onPress={handleExpandActions}>
                <Text className="text-lg font-medium">Actions</Text>
                <Icons.ChevronDown width={20} height={20} />
              </TouchableOpacity>
              {isActionsExpanded && (
                <View className="flex-col gap-2">
                  {steps?.data?.map((item, index) => {
                    const isViewableState =
                      item.state && VIEWABLE_STATES.includes(item.state);

                    return (
                      <View
                        key={index}
                        className={'flex-row gap-4 items-start'}>
                        <View
                          className={twMerge(
                            `w-5 h-5 rounded-full bg-white border-[2px] border-blue-500 justify-center items-center z-10  ${
                              currentStep - 1 === index ? 'border-[5px]' : ''
                            } ${currentStep - 1 > index ? 'bg-[#3b82f6]' : ''}`,
                          )}
                        />
                        <View>
                          {item.date && (
                            <Text className="text-sm font-normal text-[#4b5563]">
                              {item.date}
                            </Text>
                          )}
                          <View className="flex-row items-center gap-2">
                            <Text className="text-lg font-medium text-[#1f2937]">
                              {item.state
                                ? item.state
                                    .replaceAll('_', ' ')
                                    .charAt(0)
                                    .toUpperCase() +
                                  item.state
                                    .replaceAll('_', ' ')
                                    .slice(1)
                                    .toLowerCase()
                                : ''}
                            </Text>
                            {isViewableState && (
                              <TouchableOpacity
                                onPress={() => handleView(item.state)}
                                className="flex-row items-center gap-2">
                                <Text className="text-[#406aff] text-sm text-normal">
                                  View
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        {index !== steps?.data.length - 1 && (
                          <View className="absolute h-full w-[2] bg-blue-500 left-[7] top-[7]" />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            <View className="flex-col gap-2">
              {['REQUESTED', 'NEGOTIATION', 'REJECTED'].includes(
                campaigns?.status,
              ) && (
                <View>
                  <DeliverablesListAndOffers
                    campaigns={campaigns}
                    campaignDetails={campaignDetails}
                    status={
                      campaigns?.status === 'REQUESTED'
                        ? 'Request Sent'
                        : campaigns?.status === 'NEGOTIATION'
                        ? 'Offer Received By Brand'
                        : campaigns?.status === 'REJECTED'
                        ? 'Request Rejected By Brand/You'
                        : ''
                    }
                    offersAndDeliverables={
                      campaigns?.status === 'REQUESTED'
                        ? campaigns?.influencerOffer
                        : campaigns?.status === 'NEGOTIATION'
                        ? campaigns?.brandOffer
                        : campaigns?.influencerOffer
                    }
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                    icon={
                      campaigns?.status === 'REQUESTED' ? (
                        <WaitingSVG size={24} />
                      ) : campaigns?.status === 'NEGOTIATION' ? (
                        <EmailSVG size={24} />
                      ) : campaigns?.status === 'REJECTED' ? (
                        <RejectedSVG />
                      ) : (
                        ''
                      )
                    }
                  />
                </View>
              )}
              <View className="flex-col gap-3 rounded-lg">
                {campaigns?.status === 'ACCEPTED' &&
                  (() => {
                    switch (type) {
                      case 'RESORTS':
                        return <HotelsAgreementAcceptedStatus />;
                      case 'PRODUCTS':
                        return (
                          <ProductAcceptedStatus
                            campaigns={campaigns}
                            campaignDetails={campaignDetails}
                            setRefetchData={() => {
                              getAllCampaigns();
                            }}
                          />
                        );
                      default:
                        return (
                          <AcceptedStatus
                            campaigns={campaigns}
                            setRefetchData={() => {
                              getAllCampaigns();
                            }}
                          />
                        );
                    }
                  })()}

                {campaigns?.status === 'AGREEMENT_ACCEPTED' &&
                  (() => {
                    switch (type) {
                      case 'PRODUCTS':
                        return <ProductAgreementStatus campaigns={campaigns} />;
                      default:
                        return (
                          <AgreementAcceptedStatus
                            campaigns={campaigns}
                            setRefetchData={() => {
                              getAllCampaigns();
                            }}
                          />
                        );
                    }
                  })()}

                {campaigns?.status === 'BILL_PAID' && (
                  <VisitedStatus
                    campaigns={campaigns}
                    campaignDetails={campaignDetails}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {campaigns?.status === 'VISITED' && (
                  <MakePayment
                    collaborationData={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {campaigns?.status === 'DELIVERABLES_REVISION' && (
                  <DeliverablesRevision
                    campaigns={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {campaigns?.status === 'DELIVERABLES_SUBMITTED' && (
                  <DeliverableSubmitted campaigns={campaigns} />
                )}

                {campaigns?.status === 'DELIVERABLES_ACCEPTED' && (
                  <DeliverableAccepted
                    campaigns={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {campaigns?.status === 'LIVE_LINK' && (
                  <SubmitLiveLink
                    campaigns={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {/* {campaigns?.status === 'COMPLETED' && ( */}
                {true && (
                  <Completed
                    onBoarding={onBoarding}
                    campaignDetails={campaignDetails}
                    collab={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {campaigns?.status === 'VISIT_WITHDRAWN' && <VisitWithdrawn />}

                {campaigns?.status === 'DATE_CHANGE_REJECTED_BY_BRAND' && (
                  <DateChangeRejectedStatus
                    campaigns={campaigns}
                    setRefetchData={() => {
                      getAllCampaigns();
                    }}
                  />
                )}

                {/* {campaigns?.status === 'NOT_VISITED' && */}
                {true &&
                 <NotVisitedStatus />}
              </View>
            </View>
          </View>
        </View>
      );
    }
    if (activeTab === CollaborationStatusTab.ABOUT) {
      return (
        <AboutCampaign
          data={eligibleRequirements}
          campaignData={campaignDetails}
          isApplied={true}
          type={campaignDetails?.category || 'Restaurants'}
          isNegotiable={campaignDetails?.requirements[0].isNegotiable}
          selectedStore={
            campaigns?.campaignDetails?.storesData?.find(
              store => store.id === campaigns?.selectedStore,
            ) || null
          }
        />
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title=""
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => navigation.goBack()}
        showRightButton={true}
        rightIcon={<Icons.ShareIcon width={20} height={20} />}
      />
      <KeyboardAvoidingView
        className="grow p-5"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <ScrollView className="flex-1">
          <View className="m-2 p-5 border border-gray-200 rounded-lg flex-col gap-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={{
                  uri: getBrandMediaUrl(campaigns?.campaignDetails?.brandLogo),
                }}
                className="w-[44] h-[44] rounded-full"
              />
              <View>
                <Text className="text-lg font-semibold text-[#121212]">
                  {campaigns?.campaignDetails?.name}
                </Text>
                {campaigns?.selectedDate && (
                  <View className="flex-row items-center gap-2">
                    <Icons.DayCalenderIcon
                      width={14}
                      height={14}
                      fill={'#1A47E8'}
                    />
                    <Text className="text-sm font-normal text-gray-500">
                      {formatDate(campaigns?.selectedDate || '')},{' '}
                      {campaigns?.selectedTime || ''}
                    </Text>
                  </View>
                )}
                {campaigns?.campaignDetails?.storesData?.[0].website && (
                  <View className="flex-row items-center gap-2">
                    <LinkGlobeSVG />
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          campaigns?.campaignDetails?.storesData?.[0].website,
                        )
                      }>
                      <Text className="text-sm font-normal text-gray-500">
                        {campaigns?.campaignDetails?.storesData?.[0].website}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <ExpandableText
              text={campaigns?.campaignDetails?.description}
              numberOfLines={2}
              showReadMore
              containerClassName="mt-2"
              textClassName="text-md font-normal text-[#121212]"
            />
            <View className="px-3">
              <Tabs
                activeTab={activeTab}
                onTabChange={tab => {
                  setActiveTab(tab);
                }}
                campaigns={campaigns}
              />
            </View>
            <View className="h-[1] bg-gray-200 mx-5" />
            <View>
              <CustomStepper
                steps={type === 'PRODUCTS' ? productSteps : campaignSteps}
                currentStep={currentStep}
              />
            </View>
          </View>
          <View>{renderContent()}</View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FullScreenLoader visible={loading} />
      {viewDetailsModal && (
        <ViewCampaignDetailsModal
          visible={viewDetailsModal}
          onClose={() => setViewDetailsModal(false)}
          type={viewType}
          details={
            viewType === 'Request Sent'
              ? campaigns?.influencerOffer
              : viewType === 'Negotiation'
              ? campaigns?.brandOffer
              : viewType === 'Accepted'
              ? campaigns?.acceptedOffer
              : null
          }
        />
      )}
    </View>
  );
};

export default MyCampaignDetailsScreen;
