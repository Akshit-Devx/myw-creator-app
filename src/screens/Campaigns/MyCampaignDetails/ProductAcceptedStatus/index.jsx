import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';

import {useSelector} from 'react-redux';

import {Icons} from '../../../../assets/icons';
import {BenefitsSVG} from '../../../../utility/icons';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import AddressCard from '../../../../components/cards/AddressCard';
import ProductCard from '../../../../components/cards/ProductCard';
import AddressModal from '../../../../components/modals/AddressModal';
import ExceededModal from '../../../../components/modals/ExceededModal';
import {OfferBadge} from '../../CampaignDetails/AboutCampaign/CampaignBenefits';
import AutoDMCampaignCard from '../../../../components/cards/AutoDMCampaignCard';
import {
  updateCollaborationAPI,
  createInfluencerAddressAPI,
  createOrderForProductCollabAPI,
  getInfluencerAddressByInfluencerIdAPI,
} from '../../../../services/handleApi';

const ProductAcceptedStatus = ({
  campaigns,
  setRefetchData,
  campaignDetails,
}) => {
  const {onBoarding} = useSelector(state => state.onBoarding);

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const allProducts = useMemo(
    () => campaigns?.acceptedOffer?.offerings || [],
    [campaigns],
  );
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [productLinks, setProductLinks] = useState([]);
  const [linkInputs, setLinkInputs] = useState([
    {id: '1', value: '', isValid: false, error: ''},
  ]);
  const [showExceededModal, setShowExceededModal] = useState(false);
  const [messageFromInfluencer, setMessageFromInfluencer] = useState('');

  const storeWebsite =
    campaigns?.campaignDetails?.storesData?.find(
      store => store?.id === campaigns?.selectedStore,
    )?.website || '';

  const isAnyService = useMemo(
    () => allProducts[0]?.type === 'ANY_SERVICE',
    [allProducts],
  );

  const approvedAmount = campaigns?.acceptedOffer?.uptoAmount || 0;
  const remainingAmount = approvedAmount - selectedProductsTotal;

  const selectedProductsTotal = useMemo(
    () =>
      allProducts
        .filter(product => selectedProducts[product.id])
        .reduce((sum, product) => sum + Number(product.price) || 0, 0),
    [selectedProducts, allProducts],
  );

  const storeDomain = useMemo(() => {
    try {
      return new URL(storeWebsite).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [storeWebsite]);

  const handleAddMoreLink = () => {
    const newId = (linkInputs.length + 1).toString();
    setLinkInputs([
      ...linkInputs,
      {id: newId, value: '', isValid: false, error: ''},
    ]);
  };

  // Validate link on change
  const handleLinkChange = (id, value) => {
    setLinkInputs(prev =>
      prev.map(input => {
        if (input.id === id) {
          let isValid = false;
          let error = '';
          try {
            const url = new URL(value);
            const inputDomain = url.hostname.replace(/^www\./, '');
            if (storeDomain && inputDomain === storeDomain) {
              isValid = true;
              error = '';
              setProductLinks(prevLinks => {
                const index = parseInt(id) - 1;
                const newLinks = [...prevLinks];
                newLinks[index] = {url: value.trim()};
                return newLinks;
              });
            } else {
              isValid = false;
              error = 'Link must be from the store domain: ' + storeDomain;
            }
          } catch {
            isValid = false;
            error = 'Please enter a valid URL';
          }
          return {...input, value, isValid, error};
        }
        return input;
      }),
    );
  };

  const handleRemoveLink = useCallback(
    id => {
      setLinkInputs(prev => prev.filter(input => input.id !== id));
      setProductLinks(prevLinks => {
        const idxToRemove = linkInputs.findIndex(input => input.id === id);
        if (idxToRemove === -1) return prevLinks;
        const newLinks = [...prevLinks];
        newLinks.splice(idxToRemove, 1);
        return newLinks;
      });
    },
    [linkInputs],
  );

  const fetchInfluencerAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInfluencerAddressByInfluencerIdAPI(
        onBoarding?.id,
      );
      setAddresses(response.filter(address => !address?.isArchived));
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  }, [onBoarding?.id]);

  const handleSubmitAddress = useCallback(
    async values => {
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

        await createInfluencerAddressAPI(payload);
        setShowAddAddressModal(false);
        fetchInfluencerAddresses();
      } catch (error) {
        console.error('Error adding address:', error);
      }
    },
    [onBoarding?.id, fetchInfluencerAddresses],
  );

  const handlePlaceOrder = async () => {
    if (approvedAmount > 0 && selectedProductsTotal > approvedAmount) {
      setShowExceededModal(true);
      return;
    }
    try {
      const selectedAddress = addresses.find(
        address => address.id === selectedAddressId,
      );
      if (!selectedAddress) return;

      const payload = {
        collaborationId: campaigns?.id,
        influencerId: onBoarding?.id,
        brandId: campaigns?.brandId,
        campaignId: campaigns?.campaignId,
        influencerName: onBoarding?.name,
        offeringType: isAnyService ? 'ANY_PRODUCT' : 'SPECIFIC_PRODUCT',
        anyProductLinks: isAnyService ? productLinks.map(link => link.url) : [],
        products: !isAnyService
          ? Object.keys(selectedProducts).map(productId => {
              const product = allProducts.find(p => p.id === productId);
              return {
                productId,
                productName: product?.name,
                productImage: product?.media?.[0]?.link[0],
                productPrice: product?.price,
                productLink: product?.link,
              };
            })
          : [],
        messageFromInfluencer: messageFromInfluencer,
        influencerPhone: onBoarding?.phone,
        influencerAddress: `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pincode}, ${selectedAddress.country}`,
        collabApprovedAmt:
          approvedAmount === 0 ? selectedProductsTotal : approvedAmount,
        totalOrderAmt: selectedProductsTotal,
        remainingAmt: (remainingAmount < 0 ? 0 : remainingAmount).toString(),
      };
      await createOrderForProductCollabAPI(payload);

      const collabPayload = {
        id: campaigns.id,
        status: 'AGREEMENT_ACCEPTED',
        timeLine: [
          ...campaigns?.timeLine,
          {
            state: 'AGREEMENT_ACCEPTED',
            date: new Date().toISOString(),
          },
        ],
      };
      await updateCollaborationAPI(collabPayload);
      setRefetchData();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  useEffect(() => {
    fetchInfluencerAddresses();
  }, [fetchInfluencerAddresses]);

  return (
    <View className="flex-col gap-3">
      <View className="flex-col gap-2 items-center">
        <Icons.AcceptedIcon width={24} height={24} />
        <Text className="text-lg font-medium">Campaign Accepted</Text>
      </View>
      <View className="flex-row gap-3">
        <BenefitsSVG />
        <Text className="text-lg font-medium">Choose Product</Text>
      </View>
      <OfferBadge
        benefits={campaigns?.acceptedOffer}
        category={campaigns?.campaignDetails?.category}
      />

      {!isAnyService && (
        <View className="flex-row flex-wrap justify-between">
          {allProducts?.map(product => {
            return (
              <ProductCard
                key={product?.id}
                product={product}
                isSelected={!!selectedProducts[product?.id]}
                onSelect={id =>
                  setSelectedProducts(prev => {
                    const newSelected = {...prev};
                    if (newSelected[id]) {
                      delete newSelected[id];
                    } else {
                      newSelected[id] = true;
                    }
                    return newSelected;
                  })
                }
              />
            );
          })}
        </View>
      )}

      <View className="flex-col gap-3">
        {isAnyService && (
          <View className="flex-col gap-3">
            <View className="flex-col gap-2">
              <Text className="text-lg font-bold">Visit website</Text>
              <Text className="text-md font-normal text-[#6d6d6d]">
                Enter links of the product you want to buy
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  campaigns?.campaignDetails?.storesData[0]?.website,
                );
              }}
              className="my-2 flex-row items-center gap-2 p-3 bg-[#1946e7] rounded-lg self-start">
              <Icons.LinkIcon width={16} height={16} />
              <Text className="text-white font-semibold">Visit Website</Text>
            </TouchableOpacity>
            <View className="flex-col gap-2">
              <Text className="text-lg font-bold">Enter Links</Text>
              <Text className="text-md font-normal text-[#6d6d6d]">
                Enter links of the product you want to buy
              </Text>
            </View>
            <View>
              {linkInputs?.map((input, index) => (
                <View key={index} className="flex-row gap-2 items-center">
                  <InputField
                    value={input.value}
                    placeholder="Paste product link here"
                    onChangeText={text => handleLinkChange(input.id, text)}
                    error={input.error}
                    containerClassName={'flex-1'}
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveLink(input.id)}
                    className="mb-2 bg-gray-200 rounded-full p-1">
                    <Icons.CrossIcon width={14} height={14} />
                  </TouchableOpacity>
                </View>
              ))}
              <Button
                title="Add More"
                variant="secondary"
                onPress={handleAddMoreLink}
              />
            </View>
          </View>
        )}
        <View>
          <InputField
            label={'Add Specific Instruction here'}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            onChangeText={text => setMessageFromInfluencer(text)}
            inputClassName={'h-[100px]'}
            placeholder="Add instruction like your colour preference, size etc"
          />
        </View>
        <View className="flex-col gap-2">
          <Text className="text-lg font-bold">Select a delivery address</Text>
          <Text className="text-md font-normal text-[#333]">
            All addresses ({addresses?.length})
          </Text>
          {addresses?.map((address, index) => (
            <AddressCard
              key={address?.id}
              address={address}
              isSelected={selectedAddressId === address?.id}
              onSelect={() =>
                setSelectedAddressId(prevId =>
                  prevId === address?.id ? null : address?.id,
                )
              }
              userName={onBoarding?.name}
              userPhone={onBoarding?.phone}
            />
          ))}
          <Text className="text-md font-normal text-[#333]">
            Add new address
          </Text>
          <Button
            title="Add a new delivery address"
            variant="secondary"
            onPress={() => setShowAddAddressModal(true)}
          />
        </View>

        {campaignDetails?.activateAutoDm && <AutoDMCampaignCard />}

        <Button
          title="Place Order"
          disabled={
            !selectedAddressId ||
            loading ||
            (isAnyService
              ? !productLinks?.length ||
                !productLinks?.some(link => link?.url?.trim())
              : Object.keys(selectedProducts)?.length === 0)
          }
          onPress={handlePlaceOrder}
        />
      </View>
      {showAddAddressModal && (
        <AddressModal
          visible={showAddAddressModal}
          onClose={() => setShowAddAddressModal(false)}
          onSave={handleSubmitAddress}
        />
      )}
      {showExceededModal && (
        <ExceededModal
          visible={showExceededModal}
          onClose={() => setShowExceededModal(false)}
        />
      )}
    </View>
  );
};

export default memo(ProductAcceptedStatus);
