import React, {useRef} from 'react';
import {Animated, Pressable, ScrollView, Text, View} from 'react-native';

const TopTab = ({activeTab, setActiveTab}) => {
  const tabs = [
    {id: 1, name: 'All Collabs'},
    {id: 2, name: 'Waiting Approval'},
    {id: 3, name: 'In Progress'},
    {id: 4, name: 'Completed'},
    {id: 5, name: 'Rejected'},
  ];

  return (
    <View className="top-8 mx-6">
      <ScrollView
        horizontal
        contentContainerClassName="gap-4"
        showsHorizontalScrollIndicator={false}>
        {tabs.map((tab, _index) => {
          const scaleAnim = useRef(new Animated.Value(1)).current;
          const isActive = activeTab === tab.id;

          const handlePressIn = () => {
            Animated.spring(scaleAnim, {
              toValue: 0.95,
              useNativeDriver: true,
            }).start();
          };

          const handlePressOut = () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          };

          return (
            <Pressable
              key={tab.id}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => setActiveTab(tab.id)}>
              <Animated.View
                style={{
                  transform: [{scale: scaleAnim}],
                }}
                className={`py-3 px-4 bg-white rounded-xl ${
                  isActive ? 'border border-blue-600' : ''
                }`}>
                <Text
                  className={`text-lg font-semibold ${
                    isActive ? 'text-blue-600' : 'text-[#626262]'
                  }`}>
                  {tab.name}
                </Text>
              </Animated.View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TopTab;
