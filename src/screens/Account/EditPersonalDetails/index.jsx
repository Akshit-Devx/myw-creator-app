import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/elements/Button';
import {Icons} from '../../../assets/icons';
import {
  getIgDataAPI,
  getUserBySlug,
  updateinfluencer,
} from '../../../services/handleApi';
import {fetchInfluencerById} from '../../../store/slices/onBoarding';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNav from '../../../components/layouts/TopNav';

const EditPersonalDetails = ({route, navigation}) => {
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setErrors] = useState('');

  const [formData, setFormData] = useState({
    name: onBoarding?.name || '',
    phone: onBoarding?.phone || '',
    username: onBoarding?.slug || '',
    status: onBoarding?.isWallLive || false,
    email: onBoarding?.email || '',
    igUsername: onBoarding?.instagramDetails?.username || '',
  });

  const dispatch = useDispatch();

  console.log('formData', formData);

  let params = route?.params;
  const type = params?.type;

  // onBoarding?.name

  const handleInputChange = (name, inValue) => {
    let value = inValue;
    console.log('value', value);
    if (name === 'email') {
      value = inValue.toLowerCase();
    }

    setFormData({...formData, [name]: value});

    if (name == 'username') {
      debouncedValidator(name, value);
    } else {
      if (value === '') {
        if (name === 'name') {
          setErrors('Please input your name!');
          return;
        } else if (name === 'email') {
          setErrors('Please input your email!');
          return;
        } else if (name === 'igUsername') {
          setErrors('Please input your instagram username!');
          return;
        }
      }
    }
  };

  const debouncedValidator = useCallback(
    debounce(async (name, value) => {
      // if (value === onBoarding?.slug || !s) {
      //   setErrors(prev => ({...prev, username: ''}));
      //   return;
      // }

      if (value === '') {
        setErrors('Please input your username!');
        return;
      }

      const userData = await getUserBySlug(value);

      console.log('userData,,<<<<', userData);

      if (userData) {
        setErrors('Username is already taken. Please try something else!');
      } else {
        const regex = /^[a-zA-Z0-9._]{1,30}$/;
        if (!regex.test(value)) {
          setErrors('Invalid username. Please try something else!');
        } else {
          setErrors('');
        }
      }
      setFormData(prev => ({...prev, [name]: value}));
    }, 300),
    [],
  );

  const handlePress = () => navigation.goBack();

  const handleSave = async () => {
    try {
      setBtnLoading(true);

      let payload = {
        id: onBoarding.id,
      };

      if (type === 'name') {
        payload.name = formData.name;
      } else if (type === 'username') {
        payload.slug = formData.username;
      } else if (type === 'phone') {
        payload.phone = formData.phone;
      } else if (type === 'status') {
        payload.isWallLive = formData.status;
      } else if (type === 'email') {
        payload.email = formData.email;
      }

      if (type !== 'instagram-username') {
        await updateinfluencer(payload);
        dispatch(fetchInfluencerById(onBoarding?.id));
        navigation.goBack();
      } else {
        await getIgDataAPI({
          id: onBoarding.id,
          igUsername: formData.igUsername,
          tag: 'EDIT',
        });
        dispatch(fetchInfluencerById(onBoarding?.id));
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setBtnLoading(false);
    }
  };

  const isInputEmpty = () => {
    if (type === 'name') return formData.name.trim() === '';
    if (type === 'username') return formData.username.trim() === '';
    if (type === 'phone') return formData.phone.trim() === '';
    if (type === 'email') return formData.email.trim() === '';
    if (type === 'instagram-username') return formData.igUsername.trim() === '';
    return false;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      <TopNav />
      <View className="flex-1 bg-white p-5 ">
        <TouchableOpacity
          onPress={handlePress}
          className="p-2 border border-black rounded-xl self-start mb-6">
          <Icons.BackIcon width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-[28px] font-semibold">Edit Personal Details</Text>
        <View className="gap-4">
          {params?.type === 'name' && (
            <View className="gap-4 my-4">
              <Text className="text-[14px]">
                <Text className="text-red-500">* </Text>Full Name
              </Text>
              <TextInput
                className={`text-18px p-4 font-semibold border border-[#D9D9D9] rounded-xl ${
                  formData.name === '' ? 'border-red-500' : ''
                }`}
                value={formData.name}
                onChangeText={text => handleInputChange('name', text)}
              />
              {error && (
                <Text className="text-[14px] text-red-500">{error}</Text>
              )}
            </View>
          )}

          {params?.type === 'email' && (
            <View className="gap-4 my-4">
              <Text className="text-[14px]">
                <Text className="text-red-500">* </Text>Email
              </Text>
              <TextInput
                // className="text-18px p-4 font-semibold border border-[#D9D9D9] rounded-xl"
                className={`text-18px p-4 font-semibold border border-[#D9D9D9] rounded-xl ${
                  formData.email === '' ? 'border-red-500' : ''
                }`}
                placeholder="Enter your email"
                value={formData.email}
                autoCapitalize="none"
                onChangeText={text => handleInputChange('email', text)}
              />
              {error && (
                <Text className="text-[14px] text-red-500">{error}</Text>
              )}
            </View>
          )}

          {params?.type === 'username' && (
            <View className="gap-4 my-4">
              <Text className="text-[14px]">
                <Text className="text-red-500">* </Text>Username
              </Text>
              <View
                className={`flex-row items-center border border-[#D9D9D9] rounded-xl px-4 ${
                  formData.username === '' ? 'border-red-500' : ''
                }`}>
                <Text className="py-4 pr-2 text-18px font-semibold">
                  mywall.me/
                </Text>
                <View className="bg-[#D9D9D9] h-full w-[1px]" />
                <TextInput
                  placeholder="username"
                  className="pl-2 text-18px font-semibold border-[#D9D9D9]"
                  value={formData.username}
                  onChangeText={text => handleInputChange('username', text)}
                />
              </View>
              <Text className="text-[14px] text-red-500">{error}</Text>
            </View>
          )}

          {params?.type === 'instagram-username' && (
            <View className="gap-4 my-4">
              <Text className="text-[14px]">
                <Text className="text-red-500">* </Text>Username
              </Text>
              <View
                className={`flex-row items-center border border-[#D9D9D9] rounded-xl px-4 ${
                  formData.igUsername === '' ? 'border-red-500' : ''
                }`}>
                <Text className="py-4 pr-2 text-18px font-semibold">
                  instagram.com/
                </Text>
                <View className="bg-[#D9D9D9] h-full w-[1px]" />
                <TextInput
                  placeholder="igUsername"
                  className="pl-2 text-18px font-semibold border-[#D9D9D9]"
                  value={formData.igUsername}
                  onChangeText={text => handleInputChange('igUsername', text)}
                />
              </View>
              <Text className="text-[14px] text-red-500">{error}</Text>
            </View>
          )}

          <Button
            title="Save"
            size="lg"
            variant="primary"
            onPress={handleSave}
            className="rounded-xl"
            loading={btnLoading}
            disabled={isInputEmpty() || btnLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPersonalDetails;
