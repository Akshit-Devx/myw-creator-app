import {useNavigation} from '@react-navigation/native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';
import {
  formatNumber,
  getMediaURL,
  getLowestMinFollowers,
  getMediaTypeFromPath,
} from '../../../utility/helper';

const FeaturedCampaignBarterCard = ({campaign}) => {
  const navigation = useNavigation();
  const mediaType = getMediaTypeFromPath(campaign.banner);

  return (
    <TouchableOpacity
      className="relative rounded-xl overflow-hidden"
      onPress={() =>
        navigation.navigate('Detail', {
          screen: 'CampaignDetails',
          params: {
            campaignId: campaign.id,
            storeId: campaign?.storeData?.id,
          },
        })
      }>
      {mediaType === 'video' ? (
        <Video
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: 280, height: 400}}
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
          source={{uri: getMediaURL(campaign.banner)}}
          style={{width: 280, height: 400, objectFit: 'cover'}}
        />
      )}
      <Text className="absolute top-2 left-2 bg-white py-1.5 px-3 rounded-full font-semibold">
        {formatNumber(getLowestMinFollowers(campaign.requirements) || 0)}+
      </Text>
      <View className="absolute bottom-0 left-0 right-0 bg-black/70 py-3 px-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={{uri: getMediaURL(campaign?.brandLogo)}}
            className="w-14 h-14 rounded-full"
          />
          <View className="flex-col gap-0.5">
            <Text
              className="text-white text-xl font-semibold w-48"
              numberOfLines={1}>
              {campaign.name}
            </Text>
            <Text className="text-white text-md w-48" numberOfLines={1}>
              {campaign?.storeData?.city}, {campaign?.storeData?.state}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FeaturedCampaignBarterCard;
