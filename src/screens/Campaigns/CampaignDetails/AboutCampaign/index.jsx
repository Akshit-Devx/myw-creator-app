import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import References from '../References';
import {Icons} from '../../../../assets/icons';
import CampaignBenefits from './CampaignBenefits';
import CampaignEligibility from './CampaignEligibility';
import CampaignDeliverables from './CampaignDeliverables';
import CampaignAvailability from './CampaignAvailability';

const steps = [
  {title: 'Step 1', description: 'Apply for campaign'},
  {title: 'Step 2', description: 'Submit Deliverables'},
  {title: 'Step 3', description: 'Complete the campaign'},
];

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AboutCampaign = memo(
  ({data, campaignData, type, isNegotiable, selectedStore}) => {
    const [cardExpanded, setCardExpanded] = useState(false);

    const handleStepsToggle = () => {
      LayoutAnimation.easeInEaseOut();
      setCardExpanded(!cardExpanded);
    };

    return (
      <View className="p-5 flex-col gap-5">
        <CampaignBenefits
          benefits={data}
          category={campaignData?.category}
          offerings={data?.offerings}
          allowedGuests={data?.allowedGuests}
        />

        <CampaignDeliverables
          data={data}
          platform={campaignData?.requirements?.[0]?.platform || 'INSTAGRAM'}
          isNegotiable={isNegotiable}
          showTitle={true}
          padding={true}
        />

        {campaignData && <References data={campaignData} />}

        <CampaignEligibility data={data} campaignData={campaignData} />

        <CampaignAvailability
          type={type}
          campaignData={campaignData}
          selectedStore={selectedStore}
        />
        <View className="gap-2 border border-neutral-200 rounded-xl p-5">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleStepsToggle}
            className="flex-row items-center justify-between w-full">
            <Text className="text-lg font-semibold text-neutral-800">
              Steps to apply
            </Text>
            {cardExpanded ? (
              <Icons.ChevronUp width={26} height={26} />
            ) : (
              <Icons.ChevronDown width={26} height={26} />
            )}
          </TouchableOpacity>
          {cardExpanded && (
            <View className="">
              {steps?.map((step, index) => (
                <View key={index} className="flex-col items-start">
                  <View className="flex-row gap-3 items-center">
                    <View className="w-2 h-2 bg-[#1677ff] rounded-full" />
                    <Text className="text-lg font-semibold text-neutral-800">
                      {step?.title}
                    </Text>
                  </View>
                  <View className="flex-row gap-3">
                    <View className="w-[1] h-12 bg-[#1677ff] ml-[3]" />
                    <Text className="text-md font-normal text-neutral-500 mt-2">
                      {step?.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  },
);

export default AboutCampaign;
