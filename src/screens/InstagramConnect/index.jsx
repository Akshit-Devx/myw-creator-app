import {View, Alert} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';

import {useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import {useNavigation, useRoute} from '@react-navigation/native';

import {WEBSITE_URL} from '../../config/envConfig';
import {updateSocialsTokenAPI} from '../../services/handleApi';
import FullScreenLoader from '../../components/common/FullScreenLoader';
import DetailStackHeader from '../../components/common/DetailStackHeader';

const InstagramConnectScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const {url} = route.params;
  const webViewRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleNavigationStateChange = navState => {
    const {url} = navState;
    const cleanUrl = url.split('#')[0];
    const urlParams = new URLSearchParams(cleanUrl.split('?')[1]);
    const code = urlParams.get('code');
    if (code) {
      updateIgToken(code);
    }
  };

  const updateIgToken = useCallback(
    async code => {
      if (!code || !onBoarding?.id) {
        Alert.alert(
          'Error',
          'Missing required information for Instagram connection.',
        );
        return;
      }

      if (loading) {
        return;
      }

      setLoading(true);
      try {
        const payload = {
          influencerId: onBoarding.id,
          code,
          provider: 'INSTAGRAM',
          redirectUrl: `${WEBSITE_URL}/configure/instagram/`,
        };
        console.log('payload', payload);
        await updateSocialsTokenAPI(payload);
        navigation.goBack();
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          'Connection Failed',
          'Failed to connect Instagram account. Please try again.',
          [{text: 'OK'}],
        );
      } finally {
        setLoading(false);
      }
    },
    [onBoarding?.id, navigation, loading],
  );

  return (
    <View className="flex-1">
      <DetailStackHeader
        title="Instagram Connect"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <WebView
        ref={webViewRef}
        source={{
          uri: url,
        }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => {}}
        onLoadEnd={() => {}}
        onError={() => {}}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        // iOS specific
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Android specific
        mixedContentMode="compatibility"
      />
      <FullScreenLoader visible={loading} />
    </View>
  );
};

export default InstagramConnectScreen;
