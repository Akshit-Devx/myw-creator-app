import {useNavigation} from '@react-navigation/native';
import {Image, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Icons} from '../../../assets/icons';
import {getInfluencerMediaURL} from '../../../utility/helper';

const TopNav = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state.onBoarding);

  return (
    <View className="px-4 py-2 flex-row items-center justify-between bg-[#F8F8F8] border-gray-200">
      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {screen: 'Account'})}
        className="p-1 border border-gray-200 rounded-full">
        <Image
          source={{
            uri: getInfluencerMediaURL(onBoarding?.profilePictureWithBg),
          }}
          className="w-12 h-12 rounded-full"
          accessibilityLabel="Profile picture"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Detail', {screen: 'Invites'})}
        className="p-1 border border-gray-200 rounded-full">
        <Icons.InvitesIcon height={36} width={36} />
      </TouchableOpacity>
    </View>
  );
};

export default TopNav;
