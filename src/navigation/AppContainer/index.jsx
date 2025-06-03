import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AuthStack from '../stacks/auth';
import DetailStack from '../stacks/detail';
import MainStack from '../stacks/main';

const AppContainer = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainStack} />
        <Stack.Screen name="Detail" component={DetailStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
