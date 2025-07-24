import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

const InstagramConnectScreen = () => {
  const route = useRoute();
  const {url} = route.params;

  return (
    <View className="flex-1">
      <WebView source={{uri: url}} />
    </View>
  );
};

export default InstagramConnectScreen;
