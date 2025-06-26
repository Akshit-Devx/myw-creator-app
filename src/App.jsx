import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import store, {persistor} from './store/store';
import './styles/global.css';
import AppContainer from './navigation/AppContainer';
import {enableScreens} from 'react-native-screens';
import 'react-native-get-random-values';
import {Amplify} from 'aws-amplify';
import awsmobile from './config/aws-export';

enableScreens();

Amplify.configure(awsmobile);

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        animated
        barStyle="dark-content"
        showHideTransition="fade"
        backgroundColor="#F8F8F8"
      />
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-[#F8F8F8]">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppContainer />
            </PersistGate>
          </Provider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
