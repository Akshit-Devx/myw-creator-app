import {useEffect, useState} from 'react';
import {Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import FullScreenLoader from '../../../components/common/FullScreenLoader';
import Button from '../../../components/elements/Button';
import AddressModal from '../../../components/modals/AddressModal';
import {
  createInfluencerAddressAPI,
  getInfluencerAddressByInfluencerIdAPI,
  updateInfluencerAddressAPI,
} from '../../../services/handleApi';
import DetailStackHeader from '../../../components/common/DetailStackHeader';

const AddressesScreen = ({navigation}) => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [modalBtnLoading, setModalBtnLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getInfluencerAddressByInfluencerIdAPI(
        onBoarding?.id,
      );
      setAddresses(response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async addressData => {
    setModalBtnLoading(true);
    try {
      const payload = {
        influencerId: onBoarding?.id,
        ...addressData,
        isArchived: false,
      };

      if (editingAddress) {
        await updateInfluencerAddressAPI({
          ...payload,
          id: editingAddress.id,
        });
      } else {
        await createInfluencerAddressAPI(payload);
      }

      await fetchAddresses();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setModalBtnLoading(false);
    }
  };

  const handleEditAddress = address => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = address => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteAddress(address.id),
        },
      ],
    );
  };

  const confirmDeleteAddress = async addressId => {
    try {
      const payload = {
        id: addressId,
        isArchived: true,
      };
      await updateInfluencerAddressAPI(payload);
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleCloseModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const renderAddressItem = ({item}) => (
    <View className="p-3 flex-col gap-2 rounded-lg border border-gray-200">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-lg font-semibold w-1/2" numberOfLines={1}>
          {onBoarding?.name}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => handleEditAddress(item)}>
            <Text className="text-blue-600">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleDeleteAddress(item)}>
            <Text className="text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text>
          {[
            item.addressLine1,
            item.addressLine2,
            item.city,
            item.state,
            item.country,
            item.pincode,
          ]
            .filter(Boolean)
            .join(', ')}
        </Text>
        <Text>Phone Number: {onBoarding?.phone}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {loading && <FullScreenLoader visible={loading} />}
      <DetailStackHeader
        title="Addresses"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />

      <View className="flex-1 p-5">
        {!addresses?.length ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-xl font-medium text-gray-900 mt-4 mb-2">
              No addresses found
            </Text>
          </View>
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddressItem}
            keyExtractor={item => item.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      <View className="p-5 bg-white border-t border-gray-200">
        <Button
          title="Add New Address"
          onPress={handleAddNewAddress}
          className="bg-blue-600"
        />
      </View>

      <AddressModal
        visible={showAddressModal}
        onClose={handleCloseModal}
        onSave={data => handleSaveAddress(data)}
        initialData={editingAddress}
        isLoading={modalBtnLoading}
      />
    </View>
  );
};

const styles = {
  listContainer: {
    gap: 12,
    paddingVertical: 0,
  },
};

export default AddressesScreen;
