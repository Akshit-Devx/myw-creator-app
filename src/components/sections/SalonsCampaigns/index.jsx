import React, {useState} from 'react';
import {View} from 'react-native';
import CampaignTypeButton from '../../common/CampaignTypeButton';

const SalonsCampaignsSection = () => {
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

export default SalonsCampaignsSection;
