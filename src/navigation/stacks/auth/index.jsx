import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IgUsernameScreen from '../../../screens/IgUsername';
import LoginScreen from '../../../screens/Login';
import SplashScreen from '../../../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="IgUsername" component={IgUsernameScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
