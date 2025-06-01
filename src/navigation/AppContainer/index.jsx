import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {TouchableOpacity} from 'react-native';
// import {Icons} from '../../assets/images/icons';
// import SplashScreen from '../../screens/SplashScreen';
import BottomTabNavigation from '../BottomTab';
import LoginScreen from '../../screens/Login';
import {Icons} from '../../assets/icons';
import SplashScreen from '../../screens/SplashScreen';
import AccountScreen from '../../screens/Account';

const getScreenOptions = (title, navigation) => ({
  headerShown: true,
  headerTitle: title,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerShadowVisible: false,
  headerLeft: ({canGoBack}) =>
    canGoBack && (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* <Image source={Icons.back} className="w-6 h-6" resizeMode="contain" /> */}
        <Icons.BackIcon width={20} height={20} />
      </TouchableOpacity>
    ),
});

const AppContainer = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'Splash'}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Tab"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />

        <Stack.Screen name="Login" component={LoginScreen} />

        {/* <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="Requests"
          component={RequestsScreen}
          options={({navigation}) => getScreenOptions('Requests', navigation)}
        />
        <Stack.Screen
          name="Suggestions"
          component={SuggestionsScreen}
          options={({navigation}) =>
            getScreenOptions('Suggestions', navigation)
          }
        />
        <Stack.Screen
          name="Campaigns"
          component={CampaignsScreen}
          options={({navigation}) => getScreenOptions('Campaigns', navigation)}
        />
        <Stack.Screen
          name="Content"
          component={ContentScreen}
          options={({navigation}) => getScreenOptions('Content', navigation)}
        />
        <Stack.Screen
          name="BookingDetails"
          component={BookingDetailsScreen}
          options={({navigation}) =>
            getScreenOptions('Booking Details', navigation)
          }
        />
        <Stack.Screen
          name="CampaignDetails"
          component={CampaignDetailsScreen}
          options={({navigation}) =>
            getScreenOptions('Campaign Details', navigation)
          }
        />
        <Stack.Screen
          name="ContactUs"
          component={ContactUsScreen}
          options={({navigation}) => getScreenOptions('', navigation)}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
