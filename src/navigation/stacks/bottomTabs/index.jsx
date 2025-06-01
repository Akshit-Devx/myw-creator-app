import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import BottomTab from '../../../components/layouts/BottomTab';
import AccountStack from '../account';

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const renderTabBar = props => <BottomTab {...props} />;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBar={renderTabBar}
      initialRouteName="AccountTab">
      <Tab.Screen name="AccountTab" component={AccountStack} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
