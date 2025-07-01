import {View, Text} from 'react-native';
import React from 'react';
import TopTab from '../../components/common/TopTab.tsx';

const MyCollabsScreen = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <View className="flex-1 bg-[#F8F8F8]">
      <Text className="text-3xl font-bold ml-6 mt-4">My Campaigns</Text>
      {/* <Text className="text-3xl font-bold mt-150 text-center">
        Comming Soon
      </Text> */}
      <TopTab activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

export default MyCollabsScreen;
