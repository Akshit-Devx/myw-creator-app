import React, { memo } from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {Icons} from '../../../../assets/icons';

const DetailsCard = React.memo(({title, guidelines, references}) => {
  return (
    <View className="flex-col gap-4 my-1">
      <View className="flex-col gap-2">
        <Text className="text-lg font-semibold">{title}</Text>
        {guidelines}
      </View>
      <View className="h-[1] w-full bg-gray-300" />
      {references.map(
        (ref, index) =>
          ref.links?.length > 0 && (
            <View key={index} className="flex-col gap-2">
              {ref.links
                .filter(link => link && link.trim() !== '')
                .map((link, i) => (
                  <View
                    key={i}
                    className="flex-row items-center gap-2 justify-between">
                    <View className="flex-row items-center gap-2">
                      {ref.icon}

                      <Text className="text-md font-medium">{`Reference ${
                        i + 1
                      }`}</Text>
                    </View>

                    <TouchableOpacity
                      className="bg-[#0033e6] flex-row items-center p-2 gap-2 rounded-md"
                      onPress={() => Linking.openURL(link)}>
                      <Icons.ArrowSelector width={12} height={12} />
                      <Text className="text-md font-medium text-white">
                        Visit Link
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          ),
      )}
    </View>
  );
});

const InstagramIcons = name => {
  switch (name.toLowerCase()) {
    case 'reels':
      return <Icons.IgReel width={34} height={34} />;
    case 'stories':
      return <Icons.IgStory width={34} height={34} />;
    case 'posts':
      return <Icons.IgPost width={34} height={34} />;
    case 'shorts':
      return <Icons.ShortsIcon width={34} height={34} />;
    case 'videos':
      return <Icons.YTIcon width={34} height={34} />;

    default:
      return <Icons.IgReel />;
  }
};

const References = memo(({data}) => {
  if (
    !data?.requirements?.length ||
    data.requirements.every(r => !r.references?.length)
  ) {
    return null;
  }

  return (
    <View className="border border-gray-200 rounded-lg p-4 flex-col gap-3">
      {data.requirements?.map((req, reqIdx) =>
        req.references?.map((ref, refIdx) => (
          <DetailsCard
            key={`${reqIdx}-${refIdx}`}
            title={`${
              req.platform?.charAt(0).toUpperCase() +
              req.platform?.slice(1).toLowerCase()
            } ${
              ref.name.charAt(0).toUpperCase() + ref.name.slice(1).toLowerCase()
            }`}
            guidelines={
              <>
                {ref.description ? (
                  <Text className="text-md font-semibold text-[#9c2cf3]">
                    ✅ 1. {ref.description}
                  </Text>
                ) : null}
                {ref.guidelines?.map((guideline, guidelineIdx) => (
                  <Text className="text-md font-medium" key={guidelineIdx}>
                    ✅ {guidelineIdx + 2}. {guideline}
                  </Text>
                ))}
              </>
            }
            references={[
              {
                title: ref.name,
                links: ref.links || [],
                icon: InstagramIcons(ref.name),
              },
            ]}
          />
        )),
      )}
    </View>
  );
});

export default References;
