import {View, Text} from 'react-native';
import React, {memo, useState} from 'react';

import {Icons} from '../../../../assets/icons';
import FileUpload from '../../../../components/FileUpload';
import Button from '../../../../components/elements/Button';
import {
  createDeliverableAPI,
  updateCollaborationAPI,
} from '../../../../services/handleApi';

const VisitedStatus = ({campaigns, setRefetchData, campaignDetails}) => {
  const [reelFiles, setReelFiles] = useState([]);
  const [storyFiles, setStoryFiles] = useState([]);
  const [shortFiles, setShortFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [postFiles, setPostFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expectedDeliverables, setExpectedDeliverables] = useState(
    campaigns?.acceptedOffer || {},
  );

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
      setLoading(false);
      return;
    }

    try {
      const payload = {
        campaignId: campaigns?.campaignId,
        influencerId: campaigns?.influencerId,
        collaborationId: campaigns?.id,
        brandId: campaigns?.campaignDetails?.brandId,
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
        status: campaigns?.acceptedOffer?.autoDeliverablesApproval
          ? 'ACCEPTED'
          : 'SUBMITTED',
        timeLine: [
          {
            state: 'SUBMITTED',
            date: new Date().toISOString(),
          },
          campaigns?.acceptedOffer?.autoDeliverablesApproval && {
            state: 'ACCEPTED',
            date: new Date().toISOString(),
          },
        ].filter(Boolean),
        crmTags: campaignDetails?.crmTags,
      };

      await createDeliverableAPI(payload);

      const collabPayload = {
        id: campaigns.id,
        status: campaigns?.acceptedOffer?.autoDeliverablesApproval
          ? 'DELIVERABLES_ACCEPTED'
          : 'DELIVERABLES_SUBMITTED',
        timeLine: [
          ...campaigns?.timeLine,
          {
            state: 'DELIVERABLES_SUBMITTED',
            date: new Date().toISOString(),
          },
          campaigns?.acceptedOffer?.autoDeliverablesApproval && {
            state: 'DELIVERABLES_ACCEPTED',
            date: new Date().toISOString(),
          },
        ].filter(Boolean),
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
    <View className="flex-col gap-4">
      <View className="flex-col justify-center items-center">
        <Icons.UploadIcon width={24} height={24} />
        <Text className="text-lg font-bold text-[#2a2a2a]">
          Submit Deliverables
        </Text>
        <Text className="text-sm font-medium text-[#1946e7]">In 2-3 days</Text>
      </View>
      {!!expectedDeliverables?.reels && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="reel-upload"
            title={
              !!(reelFiles?.length < expectedDeliverables?.reels)
                ? `Upload Reels (${expectedDeliverables?.reels})`
                : 'All Reel(s) Uploaded'
            }
            subHeading={
              !!(reelFiles?.length < expectedDeliverables?.reels)
                ? 'Share your reel file here...'
                : ''
            }
            description="Upload Reels"
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
            name="shorts-upload"
            title={
              !!(shortFiles?.length < expectedDeliverables?.shorts)
                ? `Upload Shorts (${expectedDeliverables?.shorts})`
                : 'All Short(s) Uploaded'
            }
            subHeading={
              !!(shortFiles?.length < expectedDeliverables?.shorts)
                ? 'Share your story file here...'
                : ''
            }
            description="Upload Shorts"
            files={shortFiles}
            path="deliverables/shorts"
            setFiles={setShortFiles}
            maxFiles={expectedDeliverables?.shorts}
            type="SHORT"
          />
        </View>
      )}
      {!!expectedDeliverables?.stories && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="story-upload"
            title={
              !!(storyFiles?.length < expectedDeliverables?.stories)
                ? `Upload Story (${expectedDeliverables?.stories})`
                : expectedDeliverables?.stories < 1
                ? 'Story Uploaded'
                : 'All Stories Uploaded'
            }
            subHeading={
              !!(storyFiles?.length < expectedDeliverables?.stories)
                ? 'Share your story file here...'
                : ''
            }
            description="Upload Story"
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
                ? `Upload Post (${expectedDeliverables?.posts})`
                : expectedDeliverables?.posts < 1
                ? 'Post Uploaded'
                : 'All Posts Uploaded'
            }
            subHeading={
              !!(postFiles?.length < expectedDeliverables?.posts)
                ? 'Share your post file here...'
                : ''
            }
            description="Upload Post"
            files={postFiles}
            path="deliverables/posts"
            setFiles={setPostFiles}
            maxFiles={expectedDeliverables?.posts}
            type="POST"
          />
        </View>
      )}
      {!!expectedDeliverables?.videos && (
        <View className="flex-col gap-2 w-full">
          <FileUpload
            name="videos-upload"
            title={
              !!(videoFiles?.length < expectedDeliverables?.videos)
                ? `Upload Videos (${expectedDeliverables?.videos})`
                : 'All Video(s) Uploaded'
            }
            subHeading={
              !!(videoFiles?.length < expectedDeliverables?.videos)
                ? 'Share your video file here...'
                : ''
            }
            description="Upload Videos"
            files={videoFiles}
            path="deliverables/videos"
            setFiles={setVideoFiles}
            maxFiles={expectedDeliverables?.videos}
            type="VIDEO"
          />
        </View>
      )}
      <Button
        title={'Submit'}
        loading={loading}
        disabled={loading}
        onClick={handleSubmit}
      />
    </View>
  );
};

export default memo(VisitedStatus);
