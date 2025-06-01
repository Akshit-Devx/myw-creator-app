import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AccountScreen from '../../../screens/Account';

const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Profile"
        component={AccountScreen}
        options={{title: 'My Profile'}}
      />
    </Stack.Navigator>
  );
};

export default AccountStack;
