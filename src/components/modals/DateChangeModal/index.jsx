import React, {useEffect, useState} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

import Button from '../../elements/Button';
import {Icons} from '../../../assets/icons';
import VisitDateSelector from '../../../screens/Campaigns/ApplyCampaign/VisitDateSelector';

const DateChangeModal = ({
  visible,
  onClose,
  data,
  currentStore,
  onSubmit,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const isSubmitDisabled = !selectedDate;

  const isResort = data?.campaignDetails?.category === 'RESORTS';

  const acceptedOffer = data?.acceptedOffer;
  const influencerOffer = data?.influencerOffer;

  const type = data?.campaignDetails?.category;

  const offerToUse =
    data?.status === 'AGREEMENT_ACCEPTED' ? acceptedOffer : influencerOffer;

  const handleDateSubmit = data => {
    setSelectedDate(data.selectedDate);
    setSelectedTimeSlot(data.selectedTimeSlot);
  };

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      await onSubmit({
        selectedDate,
        selectedTimeSlot,
      });
    } catch (error) {
      console.error('Error submitting date change:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedTimeSlot(data?.selectedTime);
    setSelectedDate(data?.selectedDate);
  }, [data]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50 px-8">
        <View className="bg-white p-5 rounded-3xl w-full flex-col gap-3 relative">
          <View className="flex-col items-center gap-2">
            <Icons.AcceptedIcon width={24} height={24} />
            <Text className="text-lg font-medium text-neutral-800">
              Select date
            </Text>
          </View>
          {isResort && (
            <Text className="text-sm font-medium text-[#333] bg-[#f4f6ff] px-2 py-1 rounded-lg text-center">
              {offerToUse?.stayDuration?.days || '-'} Days +{' '}
              {offerToUse?.stayDuration?.nights || '-'} Nights
            </Text>
          )}
          <VisitDateSelector
            availability={currentStore?.availability}
            type={type}
            stayDuration={offerToUse?.stayDuration}
            onSubmit={handleDateSubmit}
            selectedDate={selectedDate}
            selectedTime={selectedTimeSlot}
          />
          <Button
            title="Send Request"
            loading={loading}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          />
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-5 right-5">
            <Icons.CrossIcon width={24} height={24} fill="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DateChangeModal;
