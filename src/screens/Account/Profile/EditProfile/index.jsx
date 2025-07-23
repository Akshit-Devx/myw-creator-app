import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import InputField from '../../../../components/elements/Input';
import Button from '../../../../components/elements/Button';
import {
  getUserBySlugAPI,
  updateInfluencerAPI,
} from '../../../../services/handleApi';
import {useDispatch, useSelector} from 'react-redux';
import useUsernameValidator from '../../../../hooks/useUsernameValidator';
import {fetchInfluencerById} from '../../../../store/slices/onBoarding';

const EditProfileScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {isValidating, isValid, error, validateUsername} =
    useUsernameValidator(getUserBySlugAPI);
  const {fullName, slug} = route.params || {};
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName,
    slug,
  });

  const handleUpdateName = async () => {
    setBtnLoading(true);
    try {
      const payload = {
        id: onBoarding?.id,
        name: editForm?.fullName,
      };
      await updateInfluencerAPI(payload);
      dispatch(fetchInfluencerById(onBoarding?.id));
      navigation.goBack();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUpdateSlug = async () => {
    setBtnLoading(true);
    try {
      const payload = {
        id: onBoarding?.id,
        slug: editForm?.slug,
      };
      await updateInfluencerAPI(payload);
      dispatch(fetchInfluencerById(onBoarding?.id));
      navigation.goBack();
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUsernameChange = newSlug => {
    setEditForm({...editForm, slug: newSlug});

    if (newSlug !== slug) {
      const cleanup = validateUsername(newSlug);
      return cleanup;
    }
  };

  const isOriginalSlug = editForm?.slug === slug;

  const getErrorMessage = () => {
    if (isOriginalSlug) return null;
    if (error) return error;
    return null;
  };
  const getHelperText = () => {
    if (isOriginalSlug) return null;
    if (isValidating) return 'Checking availability...';
    if (isValid === true) return 'Username is available';
    return null;
  };

  const getInputClassName = () => {
    if (isOriginalSlug) return '';
    if (isValid === true) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-200';
    }
    if (isValid === false) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-200';
    }
    return '';
  };

  const getHelperClassName = () => {
    if (isOriginalSlug) return 'text-gray-500';
    return isValid === true ? 'text-green-600' : 'text-gray-500';
  };

  return (
    <View className="bg-white flex-1 p-5">
      {!!fullName && (
        <>
          <InputField
            label="Full Name"
            placeholder="Enter Full Name"
            value={editForm?.fullName}
            onChangeText={fullName => setEditForm({...editForm, fullName})}
          />
          <Button
            title="Save"
            loading={btnLoading}
            className="mt-4"
            onPress={handleUpdateName}
          />
        </>
      )}
      {!!slug && (
        <>
          <View className="relative">
            <InputField
              label="Username"
              placeholder="Enter username"
              value={editForm?.slug}
              onChangeText={handleUsernameChange}
              error={getErrorMessage()}
              helperText={getHelperText()}
              inputClassName={getInputClassName()}
              helperClassName={getHelperClassName()}
            />

            {isValidating && !isOriginalSlug && (
              <View className="absolute right-3 top-10 justify-center">
                <ActivityIndicator size="small" color="#6B7280" />
              </View>
            )}
          </View>
          <Button
            title="Save"
            className="mt-4"
            loading={btnLoading}
            onPress={handleUpdateSlug}
            disabled={!isOriginalSlug && isValid !== true}
          />
        </>
      )}
    </View>
  );
};

export default EditProfileScreen;
