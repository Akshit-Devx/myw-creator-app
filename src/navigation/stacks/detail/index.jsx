import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HeaderBackButton from '../../../components/common/HeaderBackButton';
import AccountScreen from '../../../screens/Account';
import InvitesScreen from '../../../screens/Invites';
import CampaignDetailsScreen from '../../../screens/Campaigns/CampaignDetails';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerShadowVisible: false,
};

const getScreenOptions = (title, navigation) => ({
  title,
  headerLeft: props => <HeaderBackButton {...props} navigation={navigation} />,
});

const DetailStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Account">
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={getScreenOptions('Account', navigation)}
      />
      <Stack.Screen
        name="Invites"
        component={InvitesScreen}
        options={getScreenOptions('Invites', navigation)}
      />
      <Stack.Screen
        name="CampaignDetails"
        component={CampaignDetailsScreen}
        options={getScreenOptions('Details', navigation)}
      />
    </Stack.Navigator>
  );
};

export default DetailStack;
