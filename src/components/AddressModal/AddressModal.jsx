import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from '../Toast/Toast';
import ToastMessage from '../Toast/Toast';
import Button from '../elements/Button';

const AddressModal = ({
  showAddAddressModal,
  modalData = null,
  onOk,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    toastDisplay: '',
    toastMessage: '',
    toastType: '',
  });

  useEffect(() => {
    if (modalData) {
      setFormData({
        addressLine1: modalData?.addressLine1 || '',
        addressLine2: modalData?.addressLine2 || '',
        city: modalData?.city || '',
        state: modalData?.state || '',
        country: modalData?.country || '',
        pincode: modalData?.pincode || '',
      });
    }
  }, [modalData]);

  const showToast = (message, type) => {
    setToast({
      toastDisplay: Date.now().toString(),
      toastMessage: message,
      toastType: type,
    });
  };
  const fetchLocationByPincode = async pincode => {
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();
      const result = data[0];

      if (result.Status === 'Success' && result.PostOffice?.length > 0) {
        const postOffice = result.PostOffice[0];
        const updatedFields = {
          city: postOffice.District,
          state: postOffice.State,
          country: postOffice.Country,
        };
        setErrors(prev => ({...prev, city: '', state: '', country: ''}));
        setFormData(prev => ({
          ...prev,
          ...updatedFields,
        }));
      } else {
        showToast('Invalid Pincode or no data found', 'error');
      }
    } catch (error) {
      showToast('Failed to fetch location info', 'error');
    }
  };

  const handlePincodeChange = text => {
    setErrors({...errors, pincode: ''});
    setFormData({...formData, pincode: text});
    if (/^\d{6}$/.test(text)) {
      fetchLocationByPincode(text);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.addressLine1) newErrors.addressLine1 = 'Please enter address';
    if (!formData.pincode) newErrors.pincode = 'Please enter pincode';
    if (!formData.city) newErrors.city = 'Please enter city';
    if (!formData.state) newErrors.state = 'Please enter state';
    if (!formData.country) newErrors.country = 'Please enter country';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onOk(formData);
    }
  };

  return (
    <Modal isVisible={showAddAddressModal} onBackdropPress={onCancel}>
      <View className="bg-white p-5 rounded-lg max-h-[90%]">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-center mb-4">
            Add New Address
          </Text>
          <Text onPress={onCancel}>Close</Text>
        </View>
        <ScrollView>
          <Text className="text-sm font-medium mb-1 mt-3" numberOfLines={1}>
            Flat, House no., Building, Company ,Apartment
          </Text>
          <TextInput
            className={`border rounded-md px-3 py-3 mb-1 ${
              errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123, house no."
            value={formData.addressLine1}
            onChangeText={text => {
              setErrors({...errors, addressLine1: ''});
              setFormData({...formData, addressLine1: text});
            }}
          />
          {errors.addressLine1 && (
            <Text className="text-red-500 text-xs mb-2">
              {errors.addressLine1}
            </Text>
          )}

          <Text className="text-sm font-medium mb-1 mt-3">
            Area, Street, Sector ,Village
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-3 mb-3"
            value={formData.addressLine2}
            onChangeText={text =>
              setFormData({...formData, addressLine2: text})
            }
          />

          <View className="flex-row justify-between gap-4 flex-1 mt-3">
            <View className="flex-[0.5]">
              <Text className="text-sm font-medium mb-1">Pincode</Text>
              <TextInput
                className={`border rounded-md px-3 py-3 mb-1 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                keyboardType="numeric"
                maxLength={6}
                value={formData.pincode}
                onChangeText={handlePincodeChange}
              />
              {errors.pincode && (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.pincode}
                </Text>
              )}
            </View>

            <View className="flex-[0.5]">
              <Text className="text-sm font-medium mb-1">City</Text>
              <TextInput
                className={`border rounded-md px-3 py-3 mb-1 bg-gray-100 text-gray-600 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.city}
                editable={false}
              />
              {errors.city && (
                <Text className="text-red-500 text-xs mb-2">{errors.city}</Text>
              )}
            </View>
          </View>

          <View className="flex-row justify-between gap-4 flex-1 mt-3">
            <View className="flex-[0.5]">
              <Text className="text-sm font-medium mb-1">State</Text>
              <TextInput
                className={`border rounded-md px-3 py-3 mb-1 bg-gray-100 text-gray-600 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.state}
                editable={false}
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.state}
                </Text>
              )}
            </View>

            <View className="flex-[0.5]">
              <Text className="text-sm font-medium mb-1">Country</Text>
              <TextInput
                className={`border rounded-md px-3 py-3 mb-1 bg-gray-100 text-gray-600 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.country}
                editable={false}
              />
              {errors.country && (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.country}
                </Text>
              )}
            </View>
          </View>
          <View className="flex-row justify-between mt-6 flex-1 gap-4 ">
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onCancel}
              className="rounded-md flex-[0.5]  border-gray-300 "
            />
            <Button
              title="OK"
              onPress={handleSubmit}
              variant="primary"
              className="rounded-md flex-[0.5]"
            />
          </View>
        </ScrollView>
      </View>
      {toast.toastDisplay && (
        <ToastMessage
          toastDisplay={toast.toastDisplay}
          toastMessage={toast.toastMessage}
          toastType={toast.toastType}
        />
      )}
    </Modal>
  );
};

export default AddressModal;
