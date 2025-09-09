import React, {useMemo, useState} from 'react';
import {View, Text, ActivityIndicator, Image} from 'react-native';

import {PNGs} from '../../../../assets/png';
import {Icons} from '../../../../assets/icons';
import {getMediaURL} from '../../../../utility/helper';
import FileUpload from '../../../../components/FileUpload';
import Button from '../../../../components/elements/Button';
import {
  updateDeliverableAPI,
  updateCollaborationAPI,
} from '../../../../services/handleApi';

const DeliverablesRevision = ({campaigns, setRefetchData}) => {
  const [reelFiles, setReelFiles] = useState([]);
  const [storyFiles, setStoryFiles] = useState([]);
  const [shortFiles, setShortFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expectedDeliverables, setExpectedDeliverables] = useState(
    campaigns?.acceptedOffer || {},
  );

  const logo = useMemo(() => {
    const logoImg = campaigns?.campaignDetails?.storesData?.find(
      store => store.id === campaigns?.selectedStore,
    )?.logo;
    if (logoImg) {
      return {uri: getMediaURL(logoImg)};
    } else {
      return PNGs.DummyBanner;
    }
  }, [campaigns]);

  const handleSubmit = async () => {
    setLoading(true);
    if (
      (expectedDeliverables?.reels &&
        reelFiles?.length !== expectedDeliverables?.reels) ||
      (expectedDeliverables?.stories &&
        storyFiles?.length !== expectedDeliverables?.stories) ||
      (expectedDeliverables?.shorts &&
        shortFiles?.length !== expectedDeliverables?.shorts) ||
      (expectedDeliverables?.posts &&
        postFiles?.length !== expectedDeliverables?.posts) ||
      (expectedDeliverables?.videos &&
        videoFiles?.length !== expectedDeliverables?.videos)
    ) {
      //Toast
      return;
    }

    try {
      const payload = {
        id: campaigns?.deliverables?.id,
        deliverableItems: [
          ...reelFiles?.map(item => {
            return {
              mediaUrl: item.key,
              uploadedAt: item.uploadedAt,
              type: item.type,
            };
          }),
          ...storyFiles?.map(item => {
            return {
              mediaUrl: item.key,
              uploadedAt: item.uploadedAt,
              type: item.type,
            };
          }),
          ...shortFiles?.map(item => {
            return {
              mediaUrl: item.key,
              uploadedAt: item.uploadedAt,
              type: item.type,
            };
          }),
          ...postFiles?.map(item => {
            return {
              mediaUrl: item.key,
              uploadedAt: item.uploadedAt,
              type: item.type,
            };
          }),
          ...videoFiles?.map(item => {
            return {
              mediaUrl: item.key,
              uploadedAt: item.uploadedAt,
              type: item.type,
            };
          }),
        ],
        status: 'ACCEPTED',
        timeLine: [
          ...campaigns?.deliverables?.timeLine,
          {
            state: 'RESUBMITTED',
            date: new Date().toISOString(),
          },
          {
            state: 'ACCEPTED',
            date: new Date().toISOString(),
          },
        ],
      };

      await updateDeliverableAPI(payload);

      const collabPayload = {
        id: campaigns.id,
        status: 'DELIVERABLES_ACCEPTED',
        timeLine: [
          ...campaigns?.timeLine,
          {
            state: 'DELIVERABLES_RESUBMITTED',
            date: new Date().toISOString(),
          },
          {
            state: 'DELIVERABLES_ACCEPTED',
            date: new Date().toISOString(),
          },
        ],
      };
      await updateCollaborationAPI(collabPayload);
    } catch (error) {
      console.error('Error submitting deliverables');
    } finally {
      setLoading(false);
      setRefetchData();
    }
  };

  return (
    <View className="flex-col gap-6">
      <View className="flex-col gap-1 items-center">
        <ActivityIndicator size={'small'} color="#406AFF" />
        <Text className="text-lg font-medium text-[#2a2a2a]">Feedback</Text>
      </View>
      <View className="flex-row gap-2 items-center">
        <Icons.FileIcon width={22} height={22} />
        <Text className="text-md font-semibold text-[#2a2a2a]">
          Feedback #1
        </Text>
      </View>
      <View className="bg-gray-100 rounded-lg p-2 flex-col gap-2">
        <View className=" flex-row items-center gap-4">
          <Image source={logo} className="w-[50] h-[50] rounded-full" />
          <Text className="text-md font-semibold text-[#1a1a1a] underline">
            {campaigns?.campaignDetails?.name}
          </Text>
        </View>
        {campaigns?.deliverables?.brandMessage && (
          <Text className="text-md font-semibold text-[#272727]">
            {campaigns?.deliverables?.brandMessage}
          </Text>
        )}
      </View>
      {!!expectedDeliverables?.reels && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="reel-upload"
            title={
              !!(reelFiles?.length < expectedDeliverables?.reels)
                ? 'Upload Reel(s)'
                : 'All Reel(s) Uploaded'
            }
            subHeading={
              !!(reelFiles?.length < expectedDeliverables?.reels)
                ? 'Share your reel file here...'
                : ''
            }
            description="Choose your file(s) to start uploading"
            files={reelFiles}
            path="deliverables/reels"
            setFiles={setReelFiles}
            maxFiles={expectedDeliverables?.reels}
            type="REEL"
          />
        </View>
      )}
      {!!expectedDeliverables?.shorts && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="short-upload"
            title={
              !!(shortFiles?.length < expectedDeliverables?.shorts)
                ? 'Upload Short'
                : 'All Short(s) Uploaded'
            }
            subHeading={
              !!(shortFiles?.length < expectedDeliverables?.shorts)
                ? 'Share your short file here...'
                : ''
            }
            description="Choose your file(s) to start uploading"
            files={shortFiles}
            path="deliverables/shorts"
            setFiles={setShortFiles}
            maxFiles={expectedDeliverables?.shorts}
            type="SHORT"
          />
        </View>
      )}
      {!!expectedDeliverables?.videos && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="video-upload"
            title={
              !!(videoFiles?.length < expectedDeliverables?.videos)
                ? 'Upload Video'
                : 'All Video(s) Uploaded'
            }
            subHeading={
              !!(videoFiles?.length < expectedDeliverables?.videos)
                ? 'Share your video file here...'
                : ''
            }
            description="Choose your file(s) to start uploading"
            files={videoFiles}
            path="deliverables/videos"
            setFiles={setVideoFiles}
            maxFiles={expectedDeliverables?.videos}
            type="VIDEO"
          />
        </View>
      )}
      {!!expectedDeliverables?.stories && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="story-upload"
            title={
              !!(storyFiles?.length < expectedDeliverables?.stories)
                ? 'Upload Story'
                : expectedDeliverables?.stories < 1
                ? 'Story Uploaded'
                : 'All Stories Uploaded'
            }
            subHeading={
              !!(storyFiles?.length < expectedDeliverables?.stories)
                ? 'Share your story file here...'
                : ''
            }
            description="Choose your file(s) to start uploading"
            files={storyFiles}
            path="deliverables/stories"
            setFiles={setStoryFiles}
            maxFiles={expectedDeliverables?.stories}
            type="STORY"
          />
        </View>
      )}
      {!!expectedDeliverables?.posts && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="story-upload"
            title={
              !!(postFiles?.length < expectedDeliverables?.posts)
                ? 'Upload Post'
                : expectedDeliverables?.posts < 1
                ? 'Post Uploaded'
                : 'All Posts Uploaded'
            }
            subHeading={
              !!(postFiles?.length < expectedDeliverables?.posts)
                ? 'Share your post file here...'
                : ''
            }
            description="Choose your file(s) to start uploading"
            files={postFiles}
            path="deliverables/posts"
            setFiles={setPostFiles}
            maxFiles={expectedDeliverables?.posts}
            type="POST"
          />
        </View>
      )}
      <Button
        title="Submit"
        loading={loading}
        disabled={loading}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default DeliverablesRevision;
