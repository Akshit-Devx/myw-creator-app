import React, {useMemo} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import FilePreview from '../../../../components/common/FilePreview';

const DeliverableSubmitted = ({campaigns}) => {
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

  return (
    <View className="mt-3 flex-col gap-2">
      <View className="flex-col justify-center items-center gap-1">
        <ActivityIndicator size="small" />
        <Text className="text-lg font-medium text-[#121212]">Under Review</Text>
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
    </View>
  );
};

export default DeliverableSubmitted;
