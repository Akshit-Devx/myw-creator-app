import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomTab from '../../components/layouts/BottomTab';
import AccountScreen from '../../screens/Account';
// import HomeScreen from '../../screens/Home';
// import ProfileScreen from '../../screens/Profile';
// import HistoryScreen from '../../screens/History';
// import BookingsScreen from '../../screens/Bookings';
// import QrScannerScreen from '../../screens/QrScanner';

const Tab = createBottomTabNavigator();

const renderTabBar = props => <BottomTab {...props} />;

const screenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
};

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Account"
      screenOptions={screenOptions}
      tabBar={renderTabBar}>
      <Tab.Screen name="Account" component={AccountScreen} />
      {/* <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="QrScanner" component={QrScannerScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
