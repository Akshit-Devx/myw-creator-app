import React, {useEffect, useState} from 'react';
import {Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getCampaignByIdAPI} from '../../../services/handleApi';
import {
  convertTo12HourFormat,
  convertToTitleCase,
  formatNumber,
  getBrandMediaURL,
  getMediaTypeFromPath,
  getRequirementByFollowerCount,
} from '../../../utility/helper';
import Video from 'react-native-video';
import {CAMPAIGN_DETAILS_TABS} from '../../../utility/common';
import Accordion from '../../../components/common/Accordian';
import {useSelector} from 'react-redux';
import VerticalStepper from '../../../components/common/VerticalStepper';
import Button from '../../../components/elements/Button';
import HeaderBackButton from '../../../components/common/HeaderBackButton';
import {Icons} from '../../../assets/icons';
import GradientText from '../../../components/common/GradientText';
import LinearGradient from 'react-native-linear-gradient';

const CampaignAboutSection = ({campaignData, followers}) => {
  const reqData = getRequirementByFollowerCount(
    campaignData,
    'INSTAGRAM',
    followers,
  );

  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <View className="p-5 flex-col gap-5">
      <LinearGradient
        colors={[
          'rgba(0, 229, 255, 0.12)',
          'rgba(198, 210, 236, 0.12)',
          'rgba(101, 31, 255, 0.09)',
          'rgba(101, 31, 255, 0.12)',
          'rgba(101, 31, 255, 0.09)',
          'rgba(255, 64, 129, 0.12)',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 0.75, y: 1.4}}
        style={{
          borderRadius: 8,
        }}>
        <View className="border border-gray-200 rounded-lg p-4 flex-col gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-semibold">Collab Benefits</Text>

            {reqData?.stayDuration &&
              reqData?.stayDuration.days > 0 &&
              reqData?.stayDuration.nights > 0 && (
                // <LinearGradient
                //   colors={['#1A47E8', '#8B5CF6']}
                //   style={{
                //     paddingHorizontal: 8,
                //     paddingVertical: 4,
                //     borderRadius: 6,
                //   }}>
                <Text className="bg-blue-500 text-white font-semibold text-md px-2 py-1 rounded-md">
                  {reqData?.stayDuration.nights} Nights/
                  {reqData?.stayDuration.days} Days
                </Text>
                // </LinearGradient>
              )}
          </View>
          {reqData?.offerPercentage > 0 || reqData?.uptoAmount > 0 ? (
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-[#0033E6E5] bg-[#d0daff] text-base font-semibold px-3 py-1 rounded-full">
                {[
                  reqData?.offerPercentage > 0 &&
                    `Get Flat ${reqData.offerPercentage}% OFF`,
                  reqData?.uptoAmount > 0 &&
                    `Get free services upto ₹${reqData.uptoAmount}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </Text>
            </View>
          ) : null}

          {!!reqData?.offerings?.length &&
            reqData?.offerings?.map((item, offeringIndex) => (
              <TouchableOpacity className="bg-white flex-row justify-between items-center p-2 rounded-md">
                <Text key={offeringIndex} className="text-lg">
                  {item?.name}
                </Text>
                <Icons.ChevronDown height={15} width={15} />
              </TouchableOpacity>
            ))}
          {!reqData?.offerings?.length && (
            <Text className="text-lg">Enjoy All Services For Free</Text>
          )}
          <View className="flex-row items-center justify-between">
            <Text className="text-lg">Guests allowed</Text>
            <Text className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
              {reqData?.allowedGuests}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View className="border border-gray-200 p-4 rounded-lg flex-col gap-3">
        <Text className="text-xl font-semibold">Eligibility</Text>
        <Text className="font-medium">
          {formatNumber(reqData?.minFollowers || 0)}+
        </Text>
      </View>
      <View className="border border-gray-200 rounded-lg flex-col gap-3">
        <Accordion
          title="Availability"
          headerClassName="bg-transparent"
          titleClassName="text-xl font-semibold">
          <View className="flex-col gap-3">
            <View className="flex-col gap-2 border-b border-gray-200 pb-5">
              <Text className="text-lg">
                {campaignData?.category === 'RESTAURANTS' ||
                campaignData?.category === 'SALONS'
                  ? 'Open Hours'
                  : 'Timings'}
              </Text>
              {(campaignData?.category === 'RESTAURANTS' ||
                campaignData?.category === 'SALONS') &&
                campaignData?.storeData?.availability?.map(
                  (item, availabilityIndex) => (
                    <View
                      key={availabilityIndex}
                      className="flex-row items-center justify-between gap-2">
                      <Text className="text-base font-medium">
                        {convertToTitleCase(item?.day)}
                      </Text>
                      <Text className="text-base font-medium">
                        {convertTo12HourFormat(item?.openTime)} -{' '}
                        {convertTo12HourFormat(item?.closeTime)}
                      </Text>
                    </View>
                  ),
                )}
              {campaignData?.category === 'RESORTS' &&
                campaignData?.storeData?.availability?.map(
                  (item, availabilityIndex) => (
                    <View
                      key={availabilityIndex}
                      className="flex-row items-center justify-between gap-2">
                      <Text className="text-base font-medium">
                        Check In: {convertTo12HourFormat(item?.openTime)}
                      </Text>
                      <Text className="text-base font-medium">-</Text>
                      <Text className="text-base font-medium">
                        Check Out: {convertTo12HourFormat(item?.closeTime)}
                      </Text>
                    </View>
                  ),
                )}
            </View>
            <View className="flex-col gap-3">
              <Text className="text-lg">Location</Text>
              <Text>
                {[
                  campaignData?.storeData?.address,
                  campaignData?.storeData?.locality,
                  campaignData?.storeData?.city,
                  campaignData?.storeData?.state,
                  campaignData?.storeData?.country,
                  campaignData?.storeData?.pincode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${campaignData?.storeData?.address},${campaignData?.storeData?.city},${campaignData?.storeData?.state},${campaignData?.storeData?.country},${campaignData?.storeData?.pincode}`,
                  )
                }>
                <Text className="text-blue-600 border border-blue-600 rounded-md px-4 py-2 self-start">
                  Get Direction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Accordion>
      </View>
      <View className="border border-gray-200 p-4 rounded-lg flex-col gap-1">
        <Text className="text-xl font-semibold">Deliverables</Text>
        <Text className="text-md">
          Things you have to deliver post acceptance
        </Text>
        <View className="flex-col gap-2 mt-3">
          {reqData?.deliverables &&
            Object?.entries(reqData?.deliverables)
              .filter(([_, value]) => value && value > 0)
              .map(([key, value]) => (
                <View className="flex-row justify-between">
                  <Text key={key} className="text-lg">
                    Instagram {convertToTitleCase(key)}
                  </Text>
                  <Text
                    key={key}
                    className="text-lg text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {value}
                  </Text>
                </View>
              ))}
        </View>
        <Text className="text-md">These deliverables are negotiable</Text>
      </View>
      <View className="border border-gray-200 rounded-lg flex-col gap-3">
        <Accordion
          title="Steps to apply"
          headerClassName="bg-transparent"
          titleClassName="text-xl font-semibold">
          <VerticalStepper
            steps={[
              {
                id: 'step1',
                title: 'Step 1',
                description: 'Apply for campaign',
              },
              {
                id: 'step2',
                title: 'Step 2',
                description: 'Submit Deliverables',
              },
              {
                id: 'step3',
                title: 'Step 3',
                description: 'Complete the campaign',
              },
            ]}
            stepIconSize="sm"
            currentStep={3}
          />
        </Accordion>
      </View>
    </View>
  );
};

const CampaignPhotosSection = ({campaignData}) => {
  const storeMedia = campaignData?.storeData?.storeMedia;
  console.log('storeMedia', storeMedia);

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
                {media?.media?.length == 0 ? (
                  <View className="w-full">
                    <Text className="text-indigo-600 text-lg text-center ">
                      No Pictures Provided
                    </Text>
                  </View>
                ) : (
                  <>
                    {media?.media?.map((item, itemIndex) => (
                      <Image
                        key={itemIndex}
                        source={{uri: getBrandMediaURL(item)}}
                        className="w-[31%] h-44 rounded-lg mb-1 object-cover"
                      />
                    ))}
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const CampaignReferencesSection = ({campaignData}) => {
  const references = campaignData?.requirements?.[0]?.references;
  return (
    <View className="p-5">
      {!references?.length && (
        <Text className="text-indigo-600 text-lg text-center">
          No References Provided
        </Text>
      )}
      {!!references?.length && (
        <View className="flex-col gap-5">
          {references?.map((reference, index) => (
            <View
              key={index}
              className="flex-col gap-4 border border-gray-200 rounded-lg p-4">
              <GradientText
                text={`Instagram ${convertToTitleCase(reference.name)}`}
                colors={['#9c2cf3', '#1a47e8']}
                style={{fontSize: 18, fontWeight: '600'}}
              />
              <Text className="text-gray-500">{reference.description}</Text>
              <View className="flex-col gap-2 border-t border-gray-200 pt-4">
                {reference?.links?.map((link, index) => (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg">Reference {index + 1}</Text>
                    <TouchableOpacity
                      className="flex-row items-center  bg-[#0033E6E6] px-2 py-2 rounded-md"
                      onPress={() => (link ? Linking.openURL(link) : '')}>
                      <Icons.ArrowSelector height={15} width={15} />
                      <Text className="self-start text-white ">Visit Link</Text>
                    </TouchableOpacity>
                  </View>
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
  const {campaignId, storeId} = route.params;
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState();
  const [selectedTab, setSelectedTab] = useState('ABOUT');

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const response = await getCampaignByIdAPI(campaignId);

      const matchingStore = (response?.storesData || []).find(
        store => store.id === storeId,
      );

      const transformedCampaign = matchingStore
        ? {...response, storeData: matchingStore}
        : null;

      setCampaignData(transformedCampaign);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const mediaType = getMediaTypeFromPath(campaignData?.banner);

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="flex-1 flex-col gap-2">
          <View>
            <View className="absolute top-5 left-0 right-0 bottom-0 z-20 p-10 flex-row justify-between">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 border border-white rounded-xl self-start">
                <Icons.BackIcon width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 border bg-white rounded-xl self-start">
                <Icons.ShareRoundedIcon width={20} height={20} />
              </TouchableOpacity>
            </View>

            {mediaType === 'video' ? (
              <Video
                source={{uri: getBrandMediaURL(campaignData?.banner)}}
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
                source={{uri: getBrandMediaURL(campaignData?.banner)}}
                style={{width: '100%', height: 300, objectFit: 'cover'}}
              />
            )}
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-20"></View>
          </View>

          <View className="mt-[-60px] bg-white mx-8 rounded-lg overflow-hidden p-5 flex-col gap-4  border border-gray-200">
            <View className="flex-row items-center gap-5">
              <Image
                source={{uri: getBrandMediaURL(campaignData?.brandLogo)}}
                className="w-16 h-16 rounded-full"
              />
              <View className="flex-col gap-1">
                <Text className="text-2xl font-semibold w-60" numberOfLines={1}>
                  {campaignData?.storeData?.name}
                </Text>
                <View className="flex-row items-center">
                  <Icons.Pin width={20} height={20} />
                  <Text
                    className="text-md text-gray-500 w-60 ml-2"
                    numberOfLines={1}>
                    {campaignData?.storeData?.city},{' '}
                    {campaignData?.storeData?.state}
                  </Text>
                </View>
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
                    <Icons.Price width={16} height={16} />
                    <Text className="text-2xl font-semibold ml-2">
                      {campaignData?.storeData?.avgPrice}
                    </Text>
                    <Text className="text-gray-500">/night</Text>

                    <View className="bg-[#f7ecff] border border-[#9c2cf3] rounded-md px-4 py-1 ml-4">
                      <GradientText
                        text={'You Get it for free'}
                        colors={['#9c2cf3', '#1a47e8']}
                      />
                    </View>
                  </View>
                </View>
              )}
          </View>

          <View className="flex-row items-center justify-between gap-5 px-5">
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
            <CampaignAboutSection
              campaignData={campaignData}
              followers={onBoarding?.instagramDetails?.followersCount || 0}
            />
          )}
          {selectedTab === 'PHOTOS' && (
            <CampaignPhotosSection campaignData={campaignData} />
          )}
          {selectedTab === 'REFERENCES' && (
            <CampaignReferencesSection campaignData={campaignData} />
          )}
        </View>
      </ScrollView>
      <View className="px-5 py-2 border-t border-gray-200 mb-8">
        <Button title="Apply Now" size="lg" />
      </View>
    </View>
  );
};

export default CampaignDetailsScreen;
