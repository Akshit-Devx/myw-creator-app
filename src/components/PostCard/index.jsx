import {Text, TouchableOpacity, Image, View} from 'react-native';
import {Icons} from '../../assets/icons';
import {formatNumber} from '../../utility/helper';

const PostCard = ({
  imageUri,
  postedDate,
  title,
  likeCount,
  commentCount,
  changeButtonText = 'Change Reel',
  onChangePress,
  showChangeButton = true,
  containerStyle = {},
  imageStyle = {},
}) => {
  return (
    <View
      className="py-[10] px-[13] border border-black/50 rounded-lg flex-row gap-[40] items-center"
      style={containerStyle}>
      {imageUri && (
        <Image
          source={{uri: imageUri}}
          className="w-[70] h-[108] rounded-md"
          style={imageStyle}
          resizeMode="cover"
        />
      )}

      <View className="flex-1 flex-col gap-[6]">
        <View>
          <Text className="text-black/50 font-normal">{postedDate}</Text>
          <Text className="text-black font-bold text-base" numberOfLines={2}>
            {title}
          </Text>
        </View>

        <View className="flex-row items-center gap-[14]">
          {likeCount?.toString() ? (
            <View className="flex-row items-center gap-[6]">
              <Icons.LikeIcon width={20} height={20} />
              <Text className="text-black/70">{formatNumber(likeCount)}</Text>
            </View>
          ) : null}
          {commentCount?.toString() ? (
            <View className="flex-row items-center gap-[6]">
              <Icons.CommentIcon width={20} height={20} />
              <Text className="text-black/70">
                {formatNumber(commentCount)}
              </Text>
            </View>
          ) : null}
        </View>

        {showChangeButton && (
          <TouchableOpacity onPress={onChangePress}>
            <Text className="text-blue-600 font-medium">
              {changeButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostCard;
