import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icons} from '../../../assets/icons';
import {useSelector} from 'react-redux';
import {
  createInfluencerAddressAPI,
  getInfluencerAddressByInfluencerIdAPI,
  updateInfluencerAddressAPI,
} from '../../../services/handleApi';
import AddressModal from '../../../components/AddressModal/AddressModal';
import ToastMessage from '../../../components/Toast/Toast';
import Button from '../../../components/elements/Button';

const AddressesScreen = ({navigation}) => {
  const {onBoarding} = useSelector(state => state?.onBoarding);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [toast, setToast] = useState({
    toastDisplay: '',
    toastMessage: '',
    toastType: '',
  });

  useEffect(() => {
    fetchInfluencerAddresses();
  }, []);

  const fetchInfluencerAddresses = async () => {
    setLoading(true);
    try {
      const response = await getInfluencerAddressByInfluencerIdAPI(
        onBoarding?.id,
      );
      const filteredResponse = response.filter(address => !address?.isArchived);
      setAddresses(filteredResponse);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({
      toastDisplay: Date.now().toString(),
      toastMessage: message,
      toastType: type,
    });
  };

  const handleEdit = address => {
    setModalData(address);
    setShowAddAddressModal(true);
  };

  const handleSubmit = async values => {
    try {
      const payload = {
        addressLine1: values.addressLine1.trim(),
        addressLine2: values.addressLine2.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        country: values.country.trim(),
        pincode: values.pincode.trim(),
        influencerId: onBoarding?.id,
        isArchived: false,
      };
      if (modalData?.id) {
        payload.id = modalData?.id;
        await updateInfluencerAddressAPI(payload);
      } else {
        await createInfluencerAddressAPI(payload);
      }
      setShowAddAddressModal(false);
      setModalData(null);
      fetchInfluencerAddresses();
      showToast('Address added successfully', 'success');
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDelete = async id => {
    try {
      const payload = {
        id,
        isArchived: true,
      };
      await updateInfluencerAddressAPI(payload);
      fetchInfluencerAddresses();
      showToast('Address deleted successfully', 'success');
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-[#F8F8F8] px-5 pt-2">
      <View className="flex-1  p-5 ">
        <View className="flex-row justify-between items-center  mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 border border-black rounded-xl self-start">
            <Icons.BackIcon width={20} height={20} />
          </TouchableOpacity>
          <Text className="text-2xl text-black ">Your Address</Text>

          <View className="px-5"></View>
        </View>
        <View className="flex-1 gap-3">
          <Text>All Address ({addresses?.length})</Text>
          {addresses?.map(address => (
            <View
              key={address?.id}
              className="px-4 py-3 bg-white rounded-md border border-[#e2e5e9]">
              <View className="flex-row items-center justify-between">
                <Text className="text-[16px] color-[#333] mb-[8px] font-semibold max-w-[250px]">
                  {onBoarding?.name}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => handleEdit(address)}>
                    <Icons.BluePencil height={20} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(address?.id)}>
                    <Icons.Delete height={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text className="text-[14px] color-[#333]">
                {[
                  address?.addressLine1,
                  address?.addressLine2,
                  address?.city,
                  address?.state,
                  address?.country,
                  address?.pincode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
              <Text className="text-[14px] color-[#333]">
                Phone number: {onBoarding?.phone}
              </Text>
            </View>
          ))}
        </View>

        <Button
          size="lg"
          title={'Add new address'}
          onPress={() => setShowAddAddressModal(true)}
        />
      </View>
      {showAddAddressModal && (
        <AddressModal
          showAddAddressModal={showAddAddressModal}
          modalData={modalData}
          onOk={handleSubmit}
          onCancel={() => {
            setShowAddAddressModal(false);
            setModalData(null);
          }}
        />
      )}
      {toast.toastDisplay && (
        <ToastMessage
          toastDisplay={toast.toastDisplay}
          toastMessage={toast.toastMessage}
          toastType={toast.toastType}
        />
      )}
    </SafeAreaView>
  );
};

export default AddressesScreen;
