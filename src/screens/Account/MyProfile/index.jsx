import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import MyWorkTab from './MyWorkTab';
import ReviewsTab from './ReviewsTab';
import {Icons} from '../../../assets/icons';
import {getMediaURL} from '../../../utility/helper';
import SocialAnalyticsTab from './SocialAnalyticsTab';
import Button from '../../../components/elements/Button';
import FullScreenLoader from '../../../components/common/FullScreenLoader';
import DetailStackHeader from '../../../components/common/DetailStackHeader';
import CreateNewCategoryModal from '../../../components/modals/CreateNewCategoryModal';
import {
  createInfluencerPortfolioCategoryAPI,
  getSocialInsightsByInfluencerId,
} from '../../../services/handleApi';

const tabs = [
  {
    key: 'social_analytics',
    title: 'Social Analytics',
    icon: Icons.SocialAnalyticsIcon,
  },
  {key: 'reviews', title: 'Reviews', icon: Icons.StarIcon},
  {key: 'my_work', title: 'My Work', icon: Icons.BagIcon},
];

const MyProfileScreen = () => {
  const navigation = useNavigation();

  const {onBoarding} = useSelector(state => state?.onBoarding);

  const [loading, setLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState('social_analytics');
  const [socialAnalyticsData, setSocialAnalyticsData] = useState(null);
  const [showAddNewSection, setShowAddNewSection] = useState(false);

  const fetchSocialAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSocialInsightsByInfluencerId(onBoarding?.id);
      setSocialAnalyticsData(response);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [onBoarding?.id]);

  const handleCreateCategory = useCallback(
    async value => {
      try {
        setLoading(true);
        const payload = {
          influencerId: onBoarding?.id,
          title: value.trim(),
          tags: [],
          customLinks: [],
          isArchived: false,
        };

        const createdCategory = await createInfluencerPortfolioCategoryAPI(
          payload,
        );
        setShowAddNewSection(false);
        navigation.navigate('EditCategory', {categoryId: createdCategory?.id});
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    },
    [onBoarding?.id, navigation],
  );

  useEffect(() => {
    fetchSocialAnalyticsData();
  }, [fetchSocialAnalyticsData]);

  return (
    <View className="flex-1 bg-white">
      <FullScreenLoader visible={loading} />
      <DetailStackHeader
        title="My Profile"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <ScrollView
        className="p-5 flex-1 relative"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, flexDirection: 'column', gap: 20}}>
        <View className="self-center item-center justify-center flex-col gap-3">
          <Image
            source={{uri: getMediaURL(onBoarding?.profilePictureWithoutBg)}}
            className="w-[100] h-[100] rounded-full"
          />
          <View className="flex-row items-center gap-2">
            <Text className="text-2xl font-semibold">{onBoarding?.name}</Text>
            <TouchableOpacity className="bg-black/30 rounded-lg p-1">
              <Icons.EditIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <FlatList
            data={tabs}
            renderItem={({item}) => {
              const isSelected = selectedTabIndex === item.key;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTabIndex(item.key)}
                  className={`flex-row items-center px-4 justify-center gap-3 border-b pb-1 ${
                    isSelected ? 'border-[#0033e6]' : 'border-white'
                  }`}>
                  <Text
                    className={`text-xl font-medium ${
                      isSelected ? 'text-[#0033e6]' : 'text-[#7e8392]'
                    }`}>
                    {item.title}
                  </Text>
                  <item.icon
                    width={20}
                    height={20}
                    fill={isSelected ? '#0033e6' : '#7e8392'}
                  />
                </TouchableOpacity>
              );
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.key}
            scrollEventThrottle={16}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={30}
          />
        </View>
        <View className="flex-1">
          {selectedTabIndex === 'social_analytics' && (
            <SocialAnalyticsTab onBoarding={onBoarding} />
          )}
          {selectedTabIndex === 'reviews' && (
            <ReviewsTab influencerId={onBoarding?.id} />
          )}
          {selectedTabIndex === 'my_work' && (
            <MyWorkTab influencerId={onBoarding?.id} navigation={navigation} />
          )}
        </View>
        <View className="h-[120]" />
      </ScrollView>
      {selectedTabIndex === 'my_work' && (
        <View className="absolute bottom-[20] right-[20] left-[20]">
          <Button
            title="Add New Section"
            onPress={() => setShowAddNewSection(true)}
          />
        </View>
      )}
      <CreateNewCategoryModal
        visible={showAddNewSection}
        onClose={() => setShowAddNewSection(false)}
        handleSubmit={handleCreateCategory}
      />
    </View>
  );
};

export default MyProfileScreen;
