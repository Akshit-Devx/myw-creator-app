import {View, Text, TouchableOpacity, Linking, StyleSheet} from 'react-native';
import React, {memo, useMemo, useState} from 'react';

import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../../assets/icons';
import {BRAND_MANAGER_WEBSITE} from '../../../../config/envConfig';
import QRCodeGenerator from '../../../../components/QRCodeGenerator';
import {updateCollaborationAPI} from '../../../../services/handleApi';
import {formatDate, updateDateFormat} from '../../../../utility/helper';
import DateChangeModal from '../../../../components/modals/DateChangeModal';
import CollabActionModal from '../../../../components/modals/CollabActionModal';
import {
  CallSVG,
  LocationSVG,
  AgreementLocationSVG,
} from '../../../../utility/icons';

const AgreementAcceptedStatus = ({campaigns, setRefetchData}) => {
  const [collabActionModal, setCollabActionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dateChangeModal, setDateChangeModal] = useState(false);

  const currentStore = useMemo(() => {
    return (
      campaigns?.campaignDetails?.storesData.find(
        store => store.id === campaigns?.selectedStore,
      ) || null
    );
  }, [campaigns]);

  const handleWithdraw = async () => {
    setLoading(true);
    const payload = {
      status: 'VISIT_WITHDRAWN',
      id: campaigns.id,
      timeLine: [
        ...(campaigns?.timeLine || []),
        {
          state: 'VISIT_WITHDRAWN',
          date: new Date().toISOString(),
        },
      ],
    };
    try {
      await updateCollaborationAPI(payload);
      setRefetchData();
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async data => {
    setLoading(true);
    try {
      const payload = {
        id: campaigns.id,
        brandId: campaigns?.brandId,
        campaignCategory: campaigns?.campaignDetails?.category,
        selectedDate: data.selectedDate || campaigns?.selectedDate,
        selectedTime: data.selectedTime || campaigns?.selectedTime,
        dateChangeRequested: true,
        source: 'INFLUENCER',
        ...(data.selectedDate && {
          scheduleHistory: [
            ...(campaigns?.scheduleHistory || []),
            {
              selectedDate: campaigns.selectedDate || null,
              selectedTime: campaigns.selectedTime || null,
              source: 'INFLUENCER',
              date: new Date().toISOString(),
            },
          ],
        }),
      };
      await updateCollaborationAPI(payload);
      setRefetchData();
      setDateChangeModal(false);
    } catch (error) {
      console.error('Error updating collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <LocationSVG />
          <Text className="text-lg font-medium">Visit Place & Show QR</Text>
        </View>
        {formatDate(campaigns?.selectedDate) >
          formatDate(new Date().toISOString()) && (
          <TouchableOpacity onPress={() => setCollabActionModal(true)}>
            <Icons.ThreeDotMenuIcon width={22} height={22} />
          </TouchableOpacity>
        )}
      </View>
      <View className="flex-col gap-4">
        <View className="flex-row items-center gap-2">
          <LinearGradient
            colors={['#9c2cf3', '#1a47e8']}
            locations={[0, 1]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradient}>
            <Icons.CalendarIcon width={22} height={22} />
          </LinearGradient>
          <Text className="text-black font-medium">Visit Date</Text>
        </View>
        <View>
          <Text>{updateDateFormat(campaigns?.selectedDate)}</Text>
          <Text>{campaigns?.selectedTime}</Text>
        </View>
      </View>

      <View className="h-[1] bg-gray-200" />

      <View className="flex-row items-center gap-2">
        <LinearGradient
          colors={['#9c2cf3', '#1a47e8']}
          locations={[0, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}>
          <AgreementLocationSVG color="white" />
        </LinearGradient>
        <Text className="text-black font-medium">Location</Text>
      </View>
      <View className="flex-col gap-1">
        <Text>
          {currentStore?.name} - {currentStore?.address},{currentStore?.city}
        </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${currentStore?.address} ${currentStore?.city} ${currentStore?.state}` ||
                  '',
              )}`,
            )
          }>
          <Text className="text-blue-900 font-medium">Get Directions</Text>
        </TouchableOpacity>
      </View>
      <View className="h-[1] bg-gray-200" />
      <View className="flex-row items-center gap-2">
        <LinearGradient
          colors={['#9c2cf3', '#1a47e8']}
          locations={[0, 1]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}>
          <CallSVG color="white" />
        </LinearGradient>
        <Text className="text-black font-medium">
          Store manager contact details
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          currentStore?.storeManagerPhoneNo &&
          Linking.openURL(`tel:${currentStore.storeManagerPhoneNo}`)
        }>
        <Text className="text-blue-900 font-medium">Call now</Text>
      </TouchableOpacity>
      <View className="flex-col gap-2 justify-center items-center">
        <Text className="text-md font-semibold">
          Show this barcode to manager
        </Text>
        <QRCodeGenerator
          value={`${BRAND_MANAGER_WEBSITE}/dashboard/influencer?id=${campaigns?.id}`}
          size={175}
        />
      </View>
      <CollabActionModal
        visible={collabActionModal}
        handleClose={() => setCollabActionModal(false)}
        onWithdraw={() => {
          setCollabActionModal(false);
          handleWithdraw();
        }}
        onDateChange={() => {
          setCollabActionModal(false);
          setTimeout(() => {
            setDateChangeModal(true);
          }, 400);
        }}
      />
      <DateChangeModal
        onClose={() => {
          setDateChangeModal(false);
        }}
        visible={dateChangeModal}
        data={campaigns}
        currentStore={currentStore}
        onSubmit={handleDateChange}
      />
    </View>
  );
};

export default memo(AgreementAcceptedStatus);

const styles = StyleSheet.create({
  gradient: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
