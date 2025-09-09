import React, { memo } from 'react';
import {View, Text, TouchableOpacity, Linking, FlatList} from 'react-native';

import {twMerge} from 'tailwind-merge';
import {Icons} from '../../../../assets/icons';
import AddressCard from '../../../../components/cards/AddressCard';
import ProductDetailsCard from '../../../../components/cards/ProductDetailsCard';

const ProductAgreementStatus = ({campaigns}) => {
  const getOrderStatus = () => {
    const status = campaigns?.orderDetails?.status;
    if (status === 'SHIPPED') return 'SHIPPED';
    if (status === 'DELIVERED') return 'DELIVERED';
    return 'PENDING';
  };

  const getHeadingText = () => {
    if (campaigns?.orderDetails?.status === 'SHIPPED')
      return 'Order Dispatched';
    if (campaigns?.orderDetails?.status === 'DELIVERED')
      return 'Order Delivered';
    return 'Order Placed';
  };

  const getHeadingIcon = () => {
    if (campaigns?.orderDetails?.status === 'SHIPPED')
      return <Icons.OrderDispatchedIcon width={36} height={36} />;
    if (campaigns?.orderDetails?.status === 'DELIVERED')
      return <Icons.OrderDeliveredIcon width={36} height={36} />;
    return <Icons.CheckoutIcon width={36} height={36} />;
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimelineDate = state => {
    const timelineEntry = campaigns?.orderDetails?.timeLine?.find(
      entry => entry.state === state,
    );
    return timelineEntry ? formatDate(timelineEntry.date) : '';
  };

  const steps = [
    {
      key: 'placed',
      label: 'Order Placed',
      description: 'Order has been placed by you',
      timestamp: getTimelineDate('PENDING') || '-',
      status: 'COMPLETED',
    },
    {
      key: 'SHIPPED',
      label: 'Order Dispatched',
      description: 'Your order has been dispatched',
      timestamp: getTimelineDate('SHIPPED') || '-',
      status:
        getOrderStatus() === 'SHIPPED' || getOrderStatus() === 'DELIVERED'
          ? 'COMPLETED'
          : 'PENDING',
    },
    {
      key: 'DELIVERED',
      label: 'Order Delivered',
      description: 'Your order has been delivered',
      timestamp: getTimelineDate('DELIVERED') || '-',
      status: getOrderStatus() === 'DELIVERED' ? 'COMPLETED' : 'PENDING',
    },
  ];

  return (
    <View className="w-full">
      <View className="justify-center items-center gap-2">
        {getHeadingIcon()}
        <Text className="text-xl text-[#333333] font-medium">
          {getHeadingText()}
        </Text>
      </View>
      <View className="flex-col gap-4">
        {steps?.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isDispatchedStep =
            step.key === 'SHIPPED' || step.key === 'DISPATCHED';
          const showTrackingLink =
            isDispatchedStep &&
            campaigns?.orderDetails?.trackingLink &&
            step.status === 'COMPLETED';

          const isCompleted = step.status === 'COMPLETED';
          return (
            <View className="flex-row gap-2">
              <View
                className={twMerge(
                  'w-5 h-5 rounded-full bg-white border-[2px] justify-center items-center z-10',
                  isCompleted ? 'border-[#4CA528] bg-[#F0FFEA]' : '',
                )}
              />
              <View key={step?.key} className="gap-2 flex-1 flex-col p-2">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={twMerge(
                      'text-lg font-bold border-[2px] border-[#7E8392] rounded-lg px-2 py-1 bg-white text-[#7E8392]',
                      isCompleted
                        ? 'bg-[#F0FFEA] text-[#4CA528] border-[#4CA528]'
                        : '',
                    )}>
                    {step?.label}
                  </Text>
                </View>
                {(step.status === 'ACTIVE' || step.status === 'COMPLETED') && (
                  <>
                    <Text className="text-[#334155] text-md font-medium ">
                      {step.description}
                    </Text>
                    {step.timestamp && (
                      <Text className="text-[#334155] text-md font-medium ">
                        {step.timestamp}
                      </Text>
                    )}
                  </>
                )}
                {showTrackingLink && (
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className="bg-[#2563eb] text-white p-2 rounded-lg"
                      onPress={() =>
                        Linking.openURL(campaigns?.orderDetails?.trackingLink)
                      }>
                      <Text className="text-md font-medium text-white">
                        Track Your Order →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {!isLast && (
                <View
                  className={twMerge(
                    'absolute top-4 left-2 w-[2px] h-full bg-[#7E8392]',
                    isCompleted ? 'bg-[#4CA528]' : '',
                  )}
                />
              )}
            </View>
          );
        })}
      </View>
      <View className="flex-col gap-4">
        {campaigns?.orderDetails?.offeringType === 'SPECIFIC_PRODUCT' && (
          <View className="flex-col gap-2">
            <View>
              <Text className="text-lg text-neutral-800 font-bold">
                Selected Product
              </Text>
              <Text className="text-md text-neutral-500 font-medium">
                The items you have selected is on your way
              </Text>
            </View>
            <FlatList
              data={campaigns?.orderDetails?.products}
              className="max-h-[300]"
              contentContainerClassName="flex-col gap-3 bg-[#EFF2F5] p-2 rounded-lg"
              renderItem={({item}) => <ProductDetailsCard product={item} />}
            />
          </View>
        )}

        {campaigns?.orderDetails?.offeringType === 'ANY_PRODUCT' &&
          campaigns?.orderDetails?.anyProductLinks?.map((link, index) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(link)}
              className="flex-row justify-center items-center gap-2 p-3 rounded-lg bg-[#1946e7]">
              <Icons.LinkIcon />
              <Text className="text-white font-medium text-md">
                Check product {index + 1}
              </Text>
            </TouchableOpacity>
          ))}

        <AddressCard
          key={campaigns?.orderDetails?.influencerAddress?.id}
          address={campaigns?.orderDetails?.influencerAddress}
          isSelected={false}
          onSelect={() => {}}
          hideRadio
          userName={campaigns?.orderDetails?.influencerName}
          userPhone={campaigns?.orderDetails?.influencerPhone ?? 'N/A'}
        />
      </View>
    </View>
  );
};

export default memo(ProductAgreementStatus);
