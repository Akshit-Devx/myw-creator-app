import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../../components/common/FullScreenLoader';
import {getInstagramMedia} from '../../../../services/externalApi';

const ChooseIgPostForAutoDMScreen = () => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [reelsList, setReelsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstagramMedia();
  }, []);

  const fetchInstagramMedia = async () => {
    try {
      setLoading(true);
      const reels = await getInstagramMedia(
        onBoarding?.instagramToken?.refreshToken,
      );
      setReelsList(reels);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FullScreenLoader visible={loading} />;
  }
  console.log('reelsList', reelsList);
  return (
    <View className="flex-1 flex-col gap-5 bg-white p-5">
      <Text>ChooseIgPostForAutoDMScreen</Text>
    </View>
  );
};

export default ChooseIgPostForAutoDMScreen;
