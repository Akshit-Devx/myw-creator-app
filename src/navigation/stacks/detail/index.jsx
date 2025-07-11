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
import EditPersonalDetails from '../../../screens/Account/EditPersonalDetails';
import TopNav from '../../../components/layouts/TopNav';
import ReferralDashboard from '../../../screens/Account/ReferralDashboard';
import WithdrawEarning from '../../../screens/Account/WithdrawEarning';
import Pricing from '../../../screens/Account/Pricing';
import AutoDMDashboard from '../../../screens/AutoDMDashboard';
import AddPayoutMethod from '../../../screens/Account/AddPayoutMethod';
import EditPayoutMethod from '../../../screens/Account/WithdrawEarning/EditPayoutMethod';
import WithdrawalHistory from '../../../screens/Account/WithdrawEarning/WithdrawalHistory';

const Stack = createNativeStackNavigator();

// const screenOptions = {
//   headerShown: true,
//   headerTitleAlign: 'center',
//   headerStyle: {
//     backgroundColor: '#F8F8F8',
//   },
//   headerTitleStyle: {
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   headerShadowVisible: false,
// };

const screenOptions = {
  headerShown: false,
  // header: () => <TopNav />,
};

const getScreenOptions = (
  title,
  navigation,
  forceBack = false,
  customBackAction,
) => ({
  title: '',
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
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="Account">
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
        name="AutoDMDashboard"
        component={AutoDMDashboard}
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
      <Stack.Screen
        name="EditPersonalDetails"
        component={EditPersonalDetails}
        options={getScreenOptions('EditPersonalDetails', navigation, false)}
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
      <Stack.Screen
        name="ReferralDashboard"
        component={ReferralDashboard}
        options={getScreenOptions('MywallReferrral', navigation)}
      />
      <Stack.Screen
        name="WithdrawEarning"
        component={WithdrawEarning}
        options={getScreenOptions('ReferralDashboard', navigation)}
      />
      <Stack.Screen
        name="EditPayoutMethod"
        component={EditPayoutMethod}
        options={getScreenOptions('ReferralDashboard', navigation)}
      />
      <Stack.Screen
        name="WithdrawalHistory"
        component={WithdrawalHistory}
        options={getScreenOptions('ReferralDashboard', navigation)}
      />
      <Stack.Screen
        name="Pricing"
        component={Pricing}
        // options={getScreenOptions('Subscriptions', navigation)}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddPayoutMethod"
        component={AddPayoutMethod}
        // options={getAddPayoutMethodScreenOptions('Subscriptions', navigation)}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default DetailStack;
