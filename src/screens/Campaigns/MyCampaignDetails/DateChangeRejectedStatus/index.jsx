import {View, Text} from 'react-native';
import React, {useState} from 'react';

import {RejectedSVG} from '../../../../utility/icons';
import Button from '../../../../components/elements/Button';
import {updateCollaborationAPI} from '../../../../services/handleApi';
import DateRangeInfo from '../../ApplyCampaign/VisitDateSelector/DateRangeInfo';

const DateChangeRejectedStatus = ({campaigns, setRefetchData}) => {
  const requirements = campaigns?.campaignDetails?.requirements[0];
  const type = campaigns?.campaignDetails?.category;
  const [loading, setLoading] = useState(false);

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

  const handleChoosePrevDate = async () => {
    setLoading(true);
    const payload = {
      status: 'AGREEMENT_ACCEPTED',
      id: campaigns.id,
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

  return (
    <View className="flex-col gap-4 justify-center items-center">
      <View className="flex-col gap-2 justify-center items-center">
        <RejectedSVG />
        <Text className="text-lg font-semibold text-neutral-800">
          Date Change Rejected
        </Text>

        <Text className="text-md font-normal text-center text-neutral-800">
          The Brand is not able to full fill the rescheduling request Please
          move further with the already accepted date or withdraw your request
        </Text>
      </View>
      <DateRangeInfo
        checkIn={campaigns?.selectedDate}
        checkOut={
          campaigns?.selectedDate
            ? new Date(
                new Date(campaigns.selectedDate).getTime() +
                  (requirements?.creatorType?.[0]?.stayDuration?.days || 0) *
                    86400000,
              ).toISOString()
            : null
        }
        selectedTime={campaigns?.selectedTime}
        type={type}
      />
      <View className="flex-row w-full gap-2">
        <View className="flex-1">
          <Button
            title="Withdraw"
            variant="secondary"
            onClick={handleWithdraw}
            loading={loading}
          />
        </View>
        <View className="flex-1">
          <Button
            title="Choose Prev Date"
            onClick={handleChoosePrevDate}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default DateChangeRejectedStatus;
