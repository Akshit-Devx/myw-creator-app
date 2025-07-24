import {useNavigation} from '@react-navigation/native';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Button from '../../../components/elements/Button';
import {
  INSTAGRAM_CLIENT_ID,
  INSTAGRAM_LOGIN_SCOPES,
  WEBSITE_URL,
} from '../../../config/envConfig';

const InstagramAutoDMScreen = () => {
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);

  const handleConnectInstagram = () => {
    const url = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${WEBSITE_URL}/configure/instagram/&response_type=code&scope=${INSTAGRAM_LOGIN_SCOPES}`;
    navigation.navigate('Detail', {
      screen: 'InstagramConnect',
      params: {
        url,
      },
    });
  };

  return (
    <View className="flex-1 flex-col gap-8 bg-white p-5">
      <Text className="text-2xl text-center font-medium">
        Automatically respond to every message on IG
      </Text>

      {!onBoarding?.instagramToken?.refreshToken && (
        <Button
          title="Connect Your Instagram"
          variant="primary"
          onPress={handleConnectInstagram}
        />
      )}

      {!!onBoarding?.instagramToken?.refreshToken && (
        <View className="flex-col gap-3">
          <Button
            title="Choose New Post"
            className="border-blue-600"
            textClassName="text-blue-600"
            variant="secondary"
          />
          <Button title="Auto DM Insights" variant="primary" />
        </View>
      )}
    </View>
  );
};

export default InstagramAutoDMScreen;
