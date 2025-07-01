import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/elements/Button';
import {Icons} from '../../../assets/icons';
import {getIgDataAPI, updateinfluencer} from '../../../services/handleApi';
import {fetchInfluencerById} from '../../../store/slices/onBoarding';

const EditPersonalDetails = ({route, navigation}) => {
  const {onBoarding} = useSelector(state => state?.onBoarding);
  const [btnLoading, setBtnLoading] = useState(false);

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

  const handleInputChange = (name, value) => {
    console.log('value', value);

    setFormData({...formData, [name]: value});
  };

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

  return (
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
              className="text-18px p-4 font-semibold border border-[#D9D9D9] rounded-xl"
              value={formData.name}
              onChangeText={text => handleInputChange('name', text)}
            />
          </View>
        )}

        {params?.type === 'email' && (
          <View className="gap-4 my-4">
            <Text className="text-[14px]">
              <Text className="text-red-500">* </Text>Email
            </Text>
            <TextInput
              className="text-18px p-4 font-semibold border border-[#D9D9D9] rounded-xl"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
            />
          </View>
        )}

        {params?.type === 'username' && (
          <View className="gap-4 my-4">
            <Text className="text-[14px]">
              <Text className="text-red-500">* </Text>Username
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-xl px-4">
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
          </View>
        )}

        {params?.type === 'instagram-username' && (
          <View className="gap-4 my-4">
            <Text className="text-[14px]">
              <Text className="text-red-500">* </Text>Username
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-xl px-4">
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
          </View>
        )}

        <Button
          title="Save"
          size="lg"
          variant="primary"
          onPress={handleSave}
          className="rounded-xl"
          loading={btnLoading}
        />
      </View>
    </View>
  );
};

export default EditPersonalDetails;
