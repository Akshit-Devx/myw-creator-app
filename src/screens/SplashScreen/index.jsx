import {useNavigation} from '@react-navigation/native';
import {getCurrentUser} from 'aws-amplify/auth';
import {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icons} from '../../assets/icons';
import {fetchInfluencerById} from '../../store/slices/onBoarding';

const checkAuthState = async (user, onBoarding, dispatch, navigation) => {
  if (!user) {
    navigation.replace('Login');
    return;
  }

  if (onBoarding?.id) {
    if (onBoarding.profileStatusCode === 'done') {
      navigation.replace('Main');
      return;
    }
    if (onBoarding.profileStatusCode === 'step1') {
      navigation.replace('IgUsername');
      return;
    }
  }

  try {
    await dispatch(fetchInfluencerById(`${user.username}::${user.username}`));
  } catch (error) {
    console.error('Failed to fetch influencer:', error);
    navigation.replace('Login');
  }
};

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const {onBoarding} = useSelector(state => state?.onBoarding);

  const handleAuth = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      await checkAuthState(user, onBoarding, dispatch, navigation);
    } catch (error) {
      console.error('Auth error:', error);
      navigation.replace('Login');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigation, onBoarding]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Icons.MywallLogoWithName width={150} height={150} />
      {isLoading && <ActivityIndicator size="large" className="mt-4" />}
    </View>
  );
};

export default SplashScreen;
