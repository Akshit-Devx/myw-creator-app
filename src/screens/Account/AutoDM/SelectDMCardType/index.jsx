import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {Icons} from '../../../../assets/icons';
import Button from '../../../../components/elements/Button';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';

const cardTypes = [
  {
    id: 1,
    title: 'Products Carousel',
    description: 'Add photos to your links',
    icon: Icons.ProductsCarouselType,
  },
  {
    id: 2,
    title: 'Single Card',
    description: 'One message can have maximum 3 buttons',
    icon: Icons.SingleCardType,
  },
];

const SelectCardTypeScreen = ({navigation, route}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const onPressNext = () => {
    try {
      if (!selectedCard.id) {
        return;
      }
      navigation.navigate('CardDetails', {
        reel: {
          ...route.params?.reel,
          cardType: selectedCard.id === 2 ? 'BUTTON' : 'PRODUCT',
        },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderItem = ({item, index}) => {
    const IconComponent = item.icon;
    const isSelected = item.id === selectedCard?.id;
    return (
      <View key={item.id} className="flex-col gap-[8]">
        <View>
          <Text className="text-xl text-neutral-800 font-bold">
            {item.title}
          </Text>
          <Text className="text-sm text-neutral-800 font-normal">
            {item.description}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setSelectedCard(item);
          }}
          className={`border-2 rounded-[20] ${
            isSelected ? 'border-blue-500' : 'border-neutral-300'
          }`}>
          <IconComponent width={'100%'} height={242} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="bg-white flex-1">
      <DetailStackHeader
        title="Select Card Type"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="bg-white flex-1 p-5 flex-col gap-7">
        <View className="flex-col gap-[12]">
          <FlatList
            data={cardTypes}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            contentContainerStyle={{flexGrow: 1, gap: 10}}
          />
        </View>
        <Button
          onPress={onPressNext}
          title="Next"
          variant="primary"
          disabled={!selectedCard?.id}
        />
      </View>
    </View>
  );
};

export default SelectCardTypeScreen;
