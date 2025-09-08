import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {twMerge} from 'tailwind-merge';
import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../../assets/icons';
import FileUpload from '../../../../components/FileUpload';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import FilePreview from '../../../../components/common/FilePreview';
import {updateCollaborationAPI} from '../../../../services/handleApi';
import {
  IgPostSVG,
  IgReelSVG,
  YtVideoSVG,
  IgStorySVG,
  YtShortsSVG,
} from '../../../../utility/icons';

const GradientView = ({children, style}) => {
  return (
    <LinearGradient
      colors={['#9c2cf3', '#1a47e8']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={{borderRadius: 12, ...style}}>
      {children}
    </LinearGradient>
  );
};

const SubmitLiveLink = ({campaigns, setRefetchData}) => {
  const [activeTab, setActiveTab] = useState(null);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [storyFiles, setStoryFiles] = useState([]);

  const [links, setLinks] = useState({
    reels: Array(campaigns?.acceptedOffer?.reels || 0).fill(''),
    shorts: Array(campaigns?.acceptedOffer?.shorts || 0).fill(''),
    posts: Array(campaigns?.acceptedOffer?.posts || 0).fill(''),
    videos: Array(campaigns?.acceptedOffer?.videos || 0).fill(''),
  });

  const expectedDeliverables = campaigns?.acceptedOffer;
  const existingDeliverables = useMemo(
    () => campaigns?.deliverables?.deliverableItems || [],
    [campaigns?.deliverables?.deliverableItems],
  );

  const existingStoryDeliverables = useMemo(
    () => existingDeliverables.filter(item => item.type === 'STORY'),
    [existingDeliverables],
  );

  const tabs = useMemo(() => {
    const tabsData = [];

    if (expectedDeliverables?.reels) {
      const reelsCompleted = links.reels.every(link => link.trim() !== '');
      tabsData.push({
        type: 'reels',
        label: 'Reels',
        icon: <IgReelSVG size={22} />,
        count: expectedDeliverables?.reels,
        isCompleted: reelsCompleted,
      });
    }

    if (expectedDeliverables?.shorts) {
      const shortsCompleted = links.shorts.every(link => link.trim() !== '');
      tabsData.push({
        type: 'shorts',
        label: 'Shorts',
        // icon: <Icons.ShortsIcon width={24} height={24} />,
        icon: <YtShortsSVG size={24} />,
        count: expectedDeliverables?.shorts,
        isCompleted: shortsCompleted,
      });
    }

    if (expectedDeliverables?.stories) {
      const storiesCompleted = existingStoryDeliverables.length > 0;
      tabsData.push({
        type: 'stories',
        label: 'Stories',
        icon: <IgStorySVG />,
        count: expectedDeliverables?.stories,
        isCompleted: storiesCompleted,
      });
    }

    if (expectedDeliverables?.posts) {
      const postsCompleted = links.posts.every(link => link.trim() !== '');
      tabsData.push({
        type: 'posts',
        label: 'Posts',
        icon: <IgPostSVG />,
        count: expectedDeliverables?.posts,
        isCompleted: postsCompleted,
      });
    }

    if (expectedDeliverables?.videos) {
      const videosCompleted = links.videos.every(link => link.trim() !== '');
      tabsData.push({
        type: 'videos',
        label: 'Videos',
        icon: <YtVideoSVG size={22} />,
        count: expectedDeliverables?.videos,
        isCompleted: videosCompleted,
      });
    }

    return tabsData;
  }, [expectedDeliverables, links, existingStoryDeliverables]);

  const allRequirementsMet = useMemo(
    () => tabs.length > 0 && tabs.every(tab => tab.isCompleted),
    [tabs],
  );

  const handleLinkChange = (type, index, value) => {
    setLinks(prevLinks => {
      const newLinks = {...prevLinks};
      newLinks[type][index] = value;
      return newLinks;
    });

    if (formError) {
      setFormError('');
    }
  };

  const validateForm = () => {
    const urlRegex = /^https?:\/\/.+/i;
    const typeRegexMap = {
      reels: /^https?:\/\/(www\.)?instagram\.com\/reel\/[a-zA-Z0-9._-]+\/?/i,
      shorts: /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w\-]{11}$/,
      posts: /^https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9._-]+\/?/i,
      videos:
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}$/,
    };

    for (const type of ['reels', 'shorts', 'posts', 'videos']) {
      const expectedCount = expectedDeliverables?.[type] || 0;
      if (expectedCount === 0) continue;

      for (let i = 0; i < expectedCount; i++) {
        const link = links[type][i]?.trim();

        if (!link) {
          Alert.alert('Error', `Please fill in all ${type} links.`);
          return false;
        }

        if (!urlRegex.test(link)) {
          Alert.alert(
            'Error',
            `Link ${i + 1} for ${type} must start with http:// or https://`,
          );
          return false;
        }

        if (!typeRegexMap[type].test(link)) {
          Alert.alert(
            `Link ${i + 1} for ${type} must be a valid ${
              type === 'reels' || type === 'posts' ? 'Instagram' : 'Youtube'
            } link.`,
          );
          return false;
        }
      }
    }

    if (expectedDeliverables?.stories) {
      if (existingStoryDeliverables.length !== expectedDeliverables.stories) {
        Alert.alert('Error', 'Please upload story files.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const liveLinks = [
        ...(existingStoryDeliverables?.length > 0
          ? existingStoryDeliverables?.map(item => ({
              type: 'STORY',
              link: item.mediaUrl,
            }))
          : storyFiles?.map(item => ({type: 'STORY', link: item.key}))),
        ...links.posts?.map(item => ({type: 'POST', link: item})),
        ...links.shorts?.map(item => ({type: 'SHORT', link: item})),
        ...links.reels?.map(item => ({type: 'REEL', link: item})),
        ...links.videos?.map(item => ({type: 'VIDEO', link: item})),
      ];

      setFormError('');
      const payload = {
        id: campaigns.id,
        influencerId: campaigns.influencerId,
        brandId: campaigns.brandId,
        campaignId: campaigns.campaignId,
        status: 'COMPLETED',
        liveLinks,
        timeLine: [
          ...campaigns?.timeLine,
          {
            state: 'COMPLETED',
            date: new Date().toISOString(),
          },
        ],
      };

      const res = await updateCollaborationAPI(payload);

      if (!res || res?.message) {
        const msg = res?.message?.includes('No matching media found')
          ? 'Invalid link. Please enter a valid link from your Instagram profile'
          : '';

        setFormError(msg);
        return;
      }

      Alert.alert('Links submitted successfully!');
    } catch (error) {
      console.log('error', error);
      setFormError('An error occurred while submitting. Please try again.');
      Alert.alert('An error occurred while submitting. Please try again.');
    } finally {
      setRefetchData();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].type);
    }
  }, [tabs, activeTab]);

  const renderTabContent = () => {
    if (!activeTab) return null;

    switch (activeTab) {
      case 'stories':
        return (
          <GradientView>
            <View className="flex-col gap-4 p-2">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg">
                  Upload Stories
                </Text>
              </View>

              {existingStoryDeliverables.length > 0 ? (
                <View className={styles.existingDeliverables}>
                  {existingStoryDeliverables.map(item => (
                    <FilePreview
                      key={item.id}
                      mediaUrl={item.mediaUrl}
                      type={item.type}
                    />
                  ))}
                </View>
              ) : (
                <FileUpload
                  name="stories"
                  title={`Upload ${expectedDeliverables?.stories} Story${
                    expectedDeliverables?.stories > 1 ? 's' : ''
                  }`}
                  subHeading="Upload your story files here"
                  description={`Upload Story ${storyFiles.length + 1}`}
                  maxFiles={expectedDeliverables?.stories || 1}
                  files={storyFiles}
                  setFiles={setStoryFiles}
                  path={`deliverables/${campaigns?.id}/stories`}
                  type="STORY"
                />
              )}
            </View>
          </GradientView>
        );

      case 'reels':
        return (
          <GradientView>
            <View className="flex-col gap-4 p-2">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg">
                  Upload Reels Live Link
                </Text>
              </View>
              {Array.from(
                {length: expectedDeliverables?.reels || 0},
                (_, i) => (
                  <InputField
                    key={i}
                    placeholder={`Reel Link ${i + 1}`}
                    value={links.reels[i]}
                    onChangeText={e => handleLinkChange('reels', i, e)}
                    autoCapitalize="none"
                  />
                ),
              )}
            </View>
          </GradientView>
        );

      case 'shorts':
        return (
          <GradientView>
            <View className="flex-col gap-4 p-2">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg">
                  Upload Shorts Live Link
                </Text>
              </View>
              {Array.from(
                {length: expectedDeliverables?.shorts || 0},
                (_, i) => (
                  <InputField
                    key={i}
                    placeholder={`Short Link ${i + 1}`}
                    value={links.shorts[i]}
                    onChangeText={e => handleLinkChange('shorts', i, e)}
                    autoCapitalize="none"
                  />
                ),
              )}
            </View>
          </GradientView>
        );

      case 'posts':
        return (
          <GradientView>
            <View className="flex-col gap-4 p-2">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg">
                  Upload Posts Live Link
                </Text>
              </View>
              {Array.from(
                {length: expectedDeliverables?.posts || 0},
                (_, i) => (
                  <InputField
                    key={i}
                    placeholder={`Post Link ${i + 1}`}
                    value={links.posts[i]}
                    onChangeText={e => handleLinkChange('posts', i, e)}
                    autoCapitalize="none"
                  />
                ),
              )}
            </View>
          </GradientView>
        );

      case 'videos':
        return (
          <GradientView>
            <View className="flex-col gap-4 p-2">
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg">
                  Upload Videos Live Link
                </Text>
              </View>
              {Array.from(
                {length: expectedDeliverables?.videos || 0},
                (_, i) => (
                  <InputField
                    key={i}
                    placeholder={`Video Link ${i + 1}`}
                    value={links.videos[i]}
                    onChangeText={e => handleLinkChange('videos', i, e)}
                    autoCapitalize="none"
                  />
                ),
              )}
            </View>
          </GradientView>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-col items-center">
        <Icons.DoubleTickIcon width={24} height={24} />
        <Text className="text-xl text-[#2a2a2a] font-semibold">
          Submit Live Link
        </Text>
      </View>

      <FlatList
        data={tabs}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={item.type}
              style={[activeTab === item.type ? styles.tabShadow : {}]}
              activeOpacity={0.8}
              onPress={() => setActiveTab(item.type)}
              className={twMerge(
                `bg-white p-3 my-2 ${
                  activeTab === item.type ? 'border-b-2 border-[#406aff]' : ''
                }`,
              )}>
              <View className="flex-row items-center gap-2">
                {item.icon}
                <Text className="text-[#2a2a2a] font-semibold">
                  {item.label}
                </Text>
                {item.isCompleted && (
                  <Icons.AcceptedIcon width={20} height={20} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerClassName="gap-4 grow"
        keyExtractor={(item, index) => `${item.type}_${index.toString()}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-[#2a2a2a] font-semibold text-center flex-1">
            No deliverables found for this campaign.
          </Text>
        }
      />
      {renderTabContent()}

      {tabs.length > 0 && (
        <Button
          title="Submit"
          onPress={handleSubmit}
          loading={loading}
          disabled={!allRequirementsMet}
        />
      )}
    </View>
  );
};

export default SubmitLiveLink;

const styles = StyleSheet.create({
  tabShadow: {
    shadowColor: '#406aff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
