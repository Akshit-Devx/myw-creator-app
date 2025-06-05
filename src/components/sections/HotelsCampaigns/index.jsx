import React, {useState} from 'react';
import {View} from 'react-native';
import CampaignTypeButton from '../../common/CampaignTypeButton';

const HotelsCampaignsSection = () => {
  const [selectedType, setSelectedType] = useState('BARTER');
  return (
    <View>
      <CampaignTypeButton
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </View>
  );
};

export default HotelsCampaignsSection;
