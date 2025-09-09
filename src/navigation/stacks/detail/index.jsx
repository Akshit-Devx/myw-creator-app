import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import CardDetailsScreen from '../../../screens/Account/AutoDM/CardDetails';
import SelectCardTypeScreen from '../../../screens/Account/AutoDM/SelectDMCardType';
import BasicDetailsScreen from '../../../screens/Account/AutoDM/BasicDetails';
import MyProfileScreen from '../../../screens/Account/MyProfile';
import EditCategoryScreen from '../../../screens/Account/MyProfile/EditCategory';
import EditSelectedReelScreen from '../../../screens/Account/MyProfile/EditSelectedReel';
import Pricing from '../../../screens/Account/Subscription/Pricing';
import ApplyCampaignScreen from '../../../screens/Campaigns/ApplyCampaign';
import MyCampaignDetailsScreen from '../../../screens/Campaigns/MyCampaignDetails';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
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

const DetailStack = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      // initialRouteName="Account"
    >
      {/* Account Section */}
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
      <Stack.Screen name="Referrral" component={ReferrralScreen} />
      <Stack.Screen
        name="ReferrralDashboard"
        component={ReferrralDashboardScreen}
      />
      <Stack.Screen
        name="WithdrawalHistory"
        component={WithdrawalHistoryScreen}
      />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
      <Stack.Screen name="PayoutMethod" component={PayoutMethodScreen} />
      <Stack.Screen name="InstagramAutoDM" component={InstagramAutoDMScreen} />
      <Stack.Screen
        name="InstagramConnect"
        component={InstagramConnectScreen}
      />
      <Stack.Screen name="AutoDMInsights" component={AutoDMInsightsScreen} />
      <Stack.Screen
        name="ChooseIgPostForAutoDM"
        component={ChooseIgPostForAutoDMScreen}
      />
      <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
      <Stack.Screen name="SelectCardType" component={SelectCardTypeScreen} />
      <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />

      {/* Home Screen */}
      <Stack.Screen name="Invites" component={InvitesScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditCategory" component={EditCategoryScreen} />
      <Stack.Screen
        name="EditSelectedReel"
        component={EditSelectedReelScreen}
      />
      <Stack.Screen name="Pricing" component={Pricing} />
      <Stack.Screen name="ApplyCampaign" component={ApplyCampaignScreen} />
      <Stack.Screen
        name="MyCampaignDetails"
        component={MyCampaignDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default DetailStack;
