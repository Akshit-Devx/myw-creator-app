import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTab from '../../../components/layouts/BottomTab';
import TopNav from '../../../components/layouts/TopNav';
import AnalyticsScreen from '../../../screens/Analytics';
import ExploreScreen from '../../../screens/Campaigns/Explore';
import MyCollabsScreen from '../../../screens/Collabs';
import LinkInBioScreen from '../../../screens/LinkInBio';

const Tab = createBottomTabNavigator();

const screenOptions = {
  header: () => <TopNav />,
};

const renderTabBar = props => <BottomTab {...props} />;

const MainStack = () => {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBar={renderTabBar}
      initialRouteName="Explore">
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="My Collabs" component={MyCollabsScreen} />
      <Tab.Screen name="Link-in-bio" component={LinkInBioScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
};

export default MainStack;
