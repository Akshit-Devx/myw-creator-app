import React from 'react';
import {Text, View} from 'react-native';
import Button from '../../components/elements/Button';
import {signOut} from 'aws-amplify/auth';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {resetStore} from '../../store/store';

const AccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state?.onBoarding);
  console.log('onBoarding', onBoarding);

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(resetStore());
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth', params: {screen: 'Login'}}],
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      <Text>AccountScreen</Text>
      <Button onPress={handleLogout} title="Logout" />
    </View>
  );
};

export default AccountScreen;
