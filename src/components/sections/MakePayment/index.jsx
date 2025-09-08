import React, {useMemo, useState} from 'react';
import {View, Text, Alert, StyleSheet, TextInput} from 'react-native';

import {useSelector} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import {RAZORPAY_KEY} from '../../../config/envConfig';
import {
  formatNumber,
  calculateMakePaymentAmount,
} from '../../../utility/helper';
import {
  updatePaymentLogsAPI,
  updateCollaborationAPI,
  createRazorpayOrderAPI,
} from '../../../services/handleApi';

const MakePayment = ({collaborationData, setRefetchData}) => {
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [amount, setAmount] = useState(0);
  const [collaboration, setCollaboration] = useState(collaborationData);

  const discountAmt = useMemo(
    () =>
      collaboration?.campaignType === 'BARTER'
        ? amount
        : calculateMakePaymentAmount(
            amount,
            collaboration?.acceptedOffer?.offerPercentage,
            collaboration?.acceptedOffer?.uptoAmount,
          ),
    [amount, collaboration],
  );

  const handlePaymentSuccess = async data => {
    try {
      const payload = {
        id: data?.razorpay_order_id,
        status: 'SUCCESS',
      };
      await updatePaymentLogsAPI(payload);

      const collabPayload = {
        id: collaboration?.id,
        status: collaboration?.acceptedOffer?.autoDeliverablesApproval
          ? 'LIVE_LINK'
          : 'BILL_PAID',
        timeLine: [
          ...collaboration?.timeLine,
          {
            state: 'BILL_PAID',
            date: new Date().toISOString(),
          },
          collaboration?.acceptedOffer?.autoDeliverablesApproval && {
            state: 'LIVE_LINK',
            date: new Date().toISOString(),
          },
        ].filter(Boolean),
      };
      await updateCollaborationAPI(collabPayload);

      setRefetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMakePayment = async () => {
    try {
      if (!amount) {
        return;
      }

      if (Number(amount) - Number(discountAmt) <= 0) {
        handleSubmit();
        return;
      }

      const payload = {
        totalAmt: Number(amount),
        discount: Number(discountAmt),
        finalAmt: Number(amount) - Number(discountAmt),
        collaborationId: collaboration?.id,
        influencerId: collaboration?.influencerId,
        campaignId: collaboration?.campaignId,
        brandId: collaboration?.brandId,
        type: collaboration?.campaignType,
      };
      const response = await createRazorpayOrderAPI(payload);

      const options = {
        key: RAZORPAY_KEY,
        order_id: response.session,
        name: 'My Wall',
        image: Icons.MywallLogo,
        description: '',
        prefill: {
          contact: onBoarding?.phone,
        },
        theme: {
          color: '#1677ff',
        },
      };
      RazorpayCheckout.open(options)
        .then(data => {
          console.log('data =---> RazorpayCheckout', data);
          handlePaymentSuccess(data);
        })
        .catch(error => {
          if (error?.code === 0) {
            // setBtnLoading(false);
            Alert.alert('Payment Failed', error?.description);
            return;
          }
          console.error('Error: in RazorpayCheckout', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        totalAmt: Number(amount),
        discount: Number(discountAmt),
        finalAmt: Number(amount) - Number(discountAmt),
        collaborationId: collaboration?.id,
        influencerId: collaboration?.influencerId,
        campaignId: collaboration?.campaignId,
        brandId: collaboration?.brandId,
        type: collaboration?.campaignType,
        status: 'SUCCESS',
      };
      await updatePaymentLogsAPI(payload);

      const collabPayload = {
        id: collaboration?.id,
        status: 'BILL_PAID',
        timeLine: [
          ...collaboration?.timeLine,
          {
            state: 'BILL_PAID',
            date: new Date().toISOString(),
          },
        ],
      };
      await updateCollaborationAPI(collabPayload);
      setRefetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAmountChange = text => {
    // Remove non-numeric characters (except decimal for currency)
    const numericValue = text.replace(/[^0-9.]/g, '');
    setAmount(numericValue);
  };

  return (
    <View className="flex-col gap-5">
      <View
        className="flex-col gap-5 bg-white p-5 rounded-lg justify-center"
        style={styles.shadowContainer}>
        <View className="flex-row gap-5 items-center my-5">
          <Icons.LeftGradientLine />
          <Text className="text-lg font-bold text-[#626262]">
            ENTER BILL AMOUNT
          </Text>
          <Icons.RightGradientLine />
        </View>

        <TextInput
          style={styles.amountInput}
          value={amount ? `₹ ${amount}` : ''}
          onChangeText={handleAmountChange}
          keyboardType="numeric" // Ensures numeric keyboard for currency
          placeholder="₹ 0"
          placeholderTextColor="#999"
          textAlign="center" // Directly on TextInput
          className="text-[#1B223C] text-[40px] font-bold flex-1 border-b border-[#d9d9d9]"
        />
      </View>
      <View className="bg-white p-2 flex-row items-center gap-2 border border-gray-200 rounded-lg self-start">
        <Icons.DiscountIcon width={36} height={36} />
        <View className="flex-col">
          <Text className="text-black text-sm font-medium">
            Flat {`${collaboration?.acceptedOffer?.offerPercentage}%`} OFF upto
            {` ₹${formatNumber(collaboration?.acceptedOffer?.uptoAmount || 0)}`}
          </Text>
          <Text className="text-xs text-gray-500 font-medium">
            on bill payment
          </Text>
        </View>
      </View>
      <View
        className="flex-col gap-5 bg-white p-5 rounded-lg justify-center"
        style={styles.shadowContainer}>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium text-[#333]">
            Total Bill Amount
          </Text>
          <Text className="text-lg font-semibold text-[#333] flex-1 text-right">
            ₹ {formatNumber(amount)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-medium text-[#333]">
              Campaign Offer
            </Text>
            <View style={styles.gradientShadowContainer}>
              <LinearGradient
                colors={['#9c2cf3', '#1a47e8']}
                locations={[0, 1]}
                angle={177}
                style={styles.gradient}>
                <Text className="text-sm font-medium text-white px-2 py-1">
                  {collaboration?.campaignType === 'BARTER'
                    ? 100
                    : collaboration?.acceptedOffer?.offerPercentage}
                  % OFF
                </Text>
              </LinearGradient>
            </View>
          </View>
          <Text className="text-[#327600] text-lg font-semibold flex-1 text-right">
            - ₹ {formatNumber(discountAmt)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between bg-[#f8f9fe] py-1 px-2 rounded-lg">
          <Text className="text-lg font-medium text-[#333]">
            Amount Payable
          </Text>
          <Text className="text-lg font-semibold text-[#333]">
            ₹ {amount - discountAmt}
          </Text>
        </View>
        <Button
          title={
            collaboration?.campaignType === 'BARTER' ? 'Submit' : 'Make Payment'
          }
          disabled={!amount}
          onPress={() => {
            collaboration?.campaignType === 'BARTER'
              ? handleSubmit()
              : handleMakePayment();
          }}
        />
      </View>
    </View>
  );
};

export default MakePayment;

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#1A1A1A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 19,
    elevation: 5,
  },
  gradientShadowContainer: {
    shadowColor: '#9C2CF3',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  gradient: {
    borderRadius: 100,
  },
});
