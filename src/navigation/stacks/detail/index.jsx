import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HeaderBackButton from '../../../components/common/HeaderBackButton';
import AccountScreen from '../../../screens/Account';
import InvitesScreen from '../../../screens/Invites';
import CampaignDetailsScreen from '../../../screens/Campaigns/CampaignDetails';
import AddressesScreen from '../../../screens/Account/Addresses';
import MywallReferrralScreen from '../../../screens/Account/MywallReferrral';
import AutoDMScreen from '../../../screens/Account/AutoDM';
import ProfileScreen from '../../../screens/Account/Profile';
import SubscriptionsScreen from '../../../screens/Account/Subscription';
import EditProfileScreen from '../../../screens/Account/Profile/EditProfile';

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

const getScreenOptions = (
  title,
  navigation,
  forceBack = false,
  customBackAction,
) => ({
  title,
  headerLeft: props => (
    <HeaderBackButton
      {...props}
      navigation={navigation}
      canGoBack={forceBack || props.canGoBack}
      onPress={customBackAction}
    />
  ),
});

const DetailStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      // initialRouteName="Account"
    >
      {/* Account Section */}
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={getScreenOptions('Account', navigation, true, () => {
          navigation.navigate('Main', {
            screen: 'Explore',
          });
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={getScreenOptions('Profile', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={getScreenOptions(
          'Edit Profile Details',
          navigation,
          true,
          () => {
            navigation.navigate('Detail', {
              screen: 'Profile',
            });
          },
        )}
      />
      <Stack.Screen
        name="Subscriptions"
        component={SubscriptionsScreen}
        options={getScreenOptions('Subscription', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="MywallReferrral"
        component={MywallReferrralScreen}
        options={getScreenOptions('Mywall Referral', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="AutoDM"
        component={AutoDMScreen}
        options={getScreenOptions('Auto DM', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="Addresses"
        component={AddressesScreen}
        options={getScreenOptions('Addresses', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />

      {/* Home Screen */}
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
