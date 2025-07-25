import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text, TouchableOpacity} from 'react-native';
import HeaderBackButton from '../../../components/common/HeaderBackButton';
import AccountScreen from '../../../screens/Account';
import AddressesScreen from '../../../screens/Account/Addresses';
import InstagramAutoDMScreen from '../../../screens/Account/AutoDM';
import AutoDMInsightsScreen from '../../../screens/Account/AutoDM/AutoDMInsights';
import ContactUsScreen from '../../../screens/Account/ContactUs';
import ProfileScreen from '../../../screens/Account/Profile';
import EditProfileScreen from '../../../screens/Account/Profile/EditProfile';
import ReferrralScreen from '../../../screens/Account/Referrral';
import ReferrralDashboardScreen from '../../../screens/Account/Referrral/ReferrralDashboard';
import WithdrawScreen from '../../../screens/Account/Referrral/ReferrralDashboard/Withdraw';
import PayoutMethodScreen from '../../../screens/Account/Referrral/ReferrralDashboard/Withdraw/PayoutMethod';
import WithdrawalHistoryScreen from '../../../screens/Account/Referrral/ReferrralDashboard/WithdrawalHistory';
import SubscriptionsScreen from '../../../screens/Account/Subscription';
import CampaignDetailsScreen from '../../../screens/Campaigns/CampaignDetails';
import InstagramConnectScreen from '../../../screens/InstagramConnect';
import InvitesScreen from '../../../screens/Invites';
import ChooseIgPostForAutoDMScreen from '../../../screens/Account/AutoDM/ChooseIgPostForAutoDM';

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
  headerRight = null,
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
  ...(headerRight && {headerRight}),
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
        options={getScreenOptions(
          'Account',
          navigation,
          true,
          () => {
            navigation.navigate('Main', {
              screen: 'Explore',
            });
          },
          () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Detail', {
                  screen: 'ContactUs',
                });
              }}
              style={{marginRight: 10}}>
              <Text>Help</Text>
            </TouchableOpacity>
          ),
        )}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={getScreenOptions('Contact Us', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
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
        name="Referrral"
        component={ReferrralScreen}
        options={getScreenOptions('Referral', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="ReferrralDashboard"
        component={ReferrralDashboardScreen}
        options={getScreenOptions(
          'Referral Dashboard',
          navigation,
          true,
          () => {
            navigation.navigate('Detail', {
              screen: 'Referrral',
            });
          },
        )}
      />
      <Stack.Screen
        name="WithdrawalHistory"
        component={WithdrawalHistoryScreen}
        options={getScreenOptions(
          'Withdrawal History',
          navigation,
          true,
          () => {
            navigation.navigate('Detail', {
              screen: 'ReferrralDashboard',
            });
          },
        )}
      />
      <Stack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={getScreenOptions('Withdraw', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'ReferrralDashboard',
          });
        })}
      />
      <Stack.Screen
        name="PayoutMethod"
        component={PayoutMethodScreen}
        options={getScreenOptions('Payout Method', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Withdraw',
          });
        })}
      />
      <Stack.Screen
        name="InstagramAutoDM"
        component={InstagramAutoDMScreen}
        options={getScreenOptions('Instagram Auto DM', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'Account',
          });
        })}
      />
      <Stack.Screen
        name="InstagramConnect"
        component={InstagramConnectScreen}
        options={getScreenOptions('Instagram Connect', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'InstagramAutoDM',
          });
        })}
      />
      <Stack.Screen
        name="AutoDMInsights"
        component={AutoDMInsightsScreen}
        options={getScreenOptions('Auto DM Insights', navigation, true, () => {
          navigation.navigate('Detail', {
            screen: 'InstagramAutoDM',
          });
        })}
      />
      <Stack.Screen
        name="ChooseIgPostForAutoDM"
        component={ChooseIgPostForAutoDMScreen}
        options={getScreenOptions(
          'Choose Post For Auto DM',
          navigation,
          true,
          () => {
            navigation.navigate('Detail', {
              screen: 'InstagramAutoDM',
            });
          },
        )}
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
