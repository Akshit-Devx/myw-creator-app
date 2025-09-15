import React, {useMemo, useState} from 'react';
import {View, Text} from 'react-native';

import { Icons } from '../../../../assets/icons';
import Button from '../../../../components/elements/Button';
import FilePreview from '../../../../components/common/FilePreview';
import {updateCollaborationAPI} from '../../../../services/handleApi';

const DeliverableAccepted = ({campaigns, setRefetchData}) => {
  const [loading, setLoading] = useState(false);

  const mediaByType = useMemo(
    () =>
      campaigns?.deliverables?.deliverableItems?.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item);
        return acc;
      }, {}),
    [campaigns],
  );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        id: campaigns.id,
        status: 'LIVE_LINK',
        timeLine: [
          ...campaigns?.timeLine,
          {
            state: 'LIVE_LINK',
            date: new Date().toISOString(),
          },
        ],
      };
      await updateCollaborationAPI(payload);
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
      setRefetchData();
    }
  };

  return (
    <View className="mt-3 flex-col gap-2">
      <View className="flex-col justify-center items-center gap-1">
        <Icons.AcceptedIcon width={26} height={26}/>
        <Text className="text-lg font-medium text-[#121212]">Deliverables Accepted</Text>
      </View>

      {mediaByType?.REEL && (
        <View className="flex-col gap-2">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#121212]">
              Uploaded Reel(s)
            </Text>
            <Text className="text-sm font-medium text-[#6d6d6d]">
              View shared reel file here...
            </Text>
          </View>
          {mediaByType?.REEL?.map(item => (
            <FilePreview
              key={item.id}
              mediaUrl={item.mediaUrl}
              type={item.type}
            />
          ))}
        </View>
      )}
      {mediaByType?.STORY && (
        <View className="flex-col gap-2">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#121212]">
              Uploaded Story
            </Text>
            <Text className="text-sm font-medium text-[#6d6d6d]">
              View shared story file here...
            </Text>
          </View>
          {mediaByType?.STORY?.map(item => (
            <FilePreview
              key={item.id}
              mediaUrl={item.mediaUrl}
              type={item.type}
            />
          ))}
        </View>
      )}
      {mediaByType?.POST && (
        <View className="flex-col gap-2">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#121212]">
              Uploaded Post(s)
            </Text>
            <Text className="text-sm font-medium text-[#6d6d6d]">
              View shared post file here...
            </Text>
          </View>
          {mediaByType?.POST?.map(item => (
            <FilePreview
              key={item.id}
              mediaUrl={item.mediaUrl}
              type={item.type}
            />
          ))}
        </View>
      )}
      {mediaByType?.SHORT && (
        <View className="flex-col gap-2">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#121212]">
              Uploaded Short(s)
            </Text>
            <Text className="text-sm font-medium text-[#6d6d6d]">
              View shared short file here...
            </Text>
          </View>
          {mediaByType?.SHORT?.map(item => (
            <FilePreview
              key={item.id}
              mediaUrl={item.mediaUrl}
              type={item.type}
            />
          ))}
        </View>
      )}
      {mediaByType?.VIDEO && (
        <View className="flex-col gap-2">
          <View className="flex-col">
            <Text className="text-lg font-bold text-[#121212]">
              Uploaded Video(s)
            </Text>
            <Text className="text-sm font-medium text-[#6d6d6d]">
              View shared video file here...
            </Text>
          </View>
          {mediaByType?.VIDEO?.map(item => (
            <FilePreview
              key={item.id}
              mediaUrl={item.mediaUrl}
              type={item.type}
            />
          ))}
        </View>
      )}

      <Button
        title="Submit Live Link"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

export default DeliverableAccepted;
