import React, {memo} from 'react';
import {View, Text} from 'react-native';

import {Icons} from '../../../../assets/icons';
import VisitDateSelector from '../../ApplyCampaign/VisitDateSelector';

const AcceptedStatus = ({campaigns, setRefetchData}) => {
  const filteredStore = campaigns?.campaignDetails?.storesData?.find(
    store => store.id === campaigns?.selectedStore,
  );

  return (
    <View className="flex-col gap-4">
      <View className="flex-col gap-2 items-center">
        <Icons.AcceptedIcon width={24} height={24} />
        <Text className="text-lg font-medium">Campaign Accepted</Text>
      </View>
      <VisitDateSelector
        key={filteredStore?.id}
        availability={filteredStore?.availability}
        campaigns={campaigns}
        setRefetchData={setRefetchData}
        type={campaigns?.campaignType}
      />
    </View>
  );
};

export default memo(AcceptedStatus);
