import {useNavigation} from '@react-navigation/native';
import React, {useState, useCallback, memo} from 'react';
import PropTypes from 'prop-types';
import {Text, TextInput, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Icons} from '../../assets/icons';
import Button from '../../components/elements/Button';
import {getIgDataAPI} from '../../services/handleApi';
import {fetchInfluencerById} from '../../store/slices/onBoarding';

// Constants for URL patterns and reserved paths
const URL_PATTERNS = [
  /instagram\.com\/([^/?&]+)/i,
  /instagram\.com\/([^/?&]+)\/?.*?/i,
  /instagr\.am\/([^/?&]+)/i,
  /www\.instagram\.com\/([^/?&]+)/i,
  /https?:\/\/(?:www\.)?instagram\.com\/([^/?&]+)/i,
];

const RESERVED_PATHS = ['p', 'explore', 'reels', 'stories', 'direct'];

// Memoized input component
const InstagramInput = memo(({value, onChange, error, onErrorChange}) => (
  <View className="flex-col gap-1">
    <View
      className={`flex-row items-center gap-2 border border-gray-200 rounded-lg ${
        error ? 'border-red-500' : ''
      }`}>
      <View
        className={`p-3 border-r border-gray-200 ${
          error ? 'border-red-500' : ''
        }`}>
        <Icons.IgRoundedIcon height={36} width={36} />
      </View>
      <TextInput
        value={value}
        onChangeText={text => {
          onErrorChange('');
          onChange(text);
        }}
        placeholder="Enter your username or paste link"
        className={`text-lg ${error ? 'text-red-500' : ''}`}
      />
    </View>
    {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
  </View>
));

InstagramInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  onErrorChange: PropTypes.func.isRequired,
};

const IgUsernameScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {onBoarding, loading} = useSelector(state => state?.onBoarding);
  const [igUsername, setIgUsername] = useState('');
  const [igUsernameError, setIgUsernameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const extractInstagramUsername = useCallback(input => {
    input = input.trim();

    if (input.includes('/')) {
      try {
        for (const pattern of URL_PATTERNS) {
          const match = input.match(pattern);
          if (match?.[1] && !RESERVED_PATHS.includes(match[1].toLowerCase())) {
            return match[1].toLowerCase();
          }
        }
        return null;
      } catch (error) {
        console.error('Error extracting username from URL:', error);
        return null;
      }
    }

    return input.replace('@', '').toLowerCase();
  }, []);

  const isValidInstagramUsername = useCallback(username => {
    if (!username || username.includes(' ')) {
      return false;
    }
    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    return usernameRegex.test(username);
  }, []);

  const handleNext = useCallback(async () => {
    if (!igUsername.trim()) {
      setIgUsernameError('Please enter an Instagram username');
      return;
    }

    setIsLoading(true);
    try {
      const username = extractInstagramUsername(igUsername);
      if (!username || !isValidInstagramUsername(username)) {
        setIgUsernameError('Please enter a valid Instagram username');
        return;
      }

      await getIgDataAPI({
        id: onBoarding?.id,
        igUsername: username,
      });
      await dispatch(fetchInfluencerById(onBoarding?.id));

      if (!loading && onBoarding?.id) {
        navigation.replace('Main');
      }
    } catch (error) {
      console.error('Error updating Instagram username:', error);
      setIgUsernameError(
        error.message || 'Failed to update Instagram username',
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    igUsername,
    onBoarding?.id,
    loading,
    navigation,
    dispatch,
    extractInstagramUsername,
    isValidInstagramUsername,
  ]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-5 pt-10 flex-col gap-7">
        <Text className="text-3xl font-medium text-[#1F0B48]">
          Enter your instagram profile username or link
        </Text>
        <InstagramInput
          value={igUsername}
          onChange={setIgUsername}
          error={igUsernameError}
          onErrorChange={setIgUsernameError}
        />
      </View>
      <View className="p-5 bg-white">
        <Button
          title="Next"
          size="lg"
          loading={isLoading || loading}
          className="w-full"
          onPress={handleNext}
          disabled={!igUsername || isLoading || loading}
        />
      </View>
    </View>
  );
};

export default IgUsernameScreen;
