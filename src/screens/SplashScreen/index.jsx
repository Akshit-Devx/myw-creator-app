import {useNavigation} from '@react-navigation/native';
import {getCurrentUser} from 'aws-amplify/auth';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Icons} from '../../assets/icons';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          navigation.replace('Main');
        }
      } catch (error) {
        console.log('Error', error);
        navigation.replace('Login');
      }
    };

    checkAuthState();
  }, [navigation]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Icons.MywallLogoWithName width={150} height={150} />
    </View>
  );
};

export default SplashScreen;
