import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  StyleSheet,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {Icons} from '../../../../../assets/icons';
import {formatNumber} from '../../../../../utility/helper';
import {
  CloudSVG,
  BenefitsSVG,
  DiscountSVG,
} from '../../../../../utility/icons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const StayDurationBadge = memo(({stayDuration}) => {
  console.log('stayDuration.days', stayDuration?.days);
  return (
    <View className="rounded-lg overflow-hidden flex-row items-center gap-1 p-2 bg-[#9c2cf3]">
      <CloudSVG color="#FFF" />
      <Text className="text-md text-white font-medium">
        {stayDuration?.nights}
        N/{stayDuration?.days}D
      </Text>
    </View>
  );
});

export const OfferBadge = memo(({benefits, category}) => {
  const hasOffer =
    (benefits?.offerPercentage ?? 0) > 0 || (benefits?.uptoAmount ?? 0) > 0;

  if (!hasOffer) return null;
  return (
    <View className="bg-[#d0daff] flex-row items-center gap-2 justify-center rounded-full">
      {(benefits?.offerPercentage ?? 0) > 0 && (
        <DiscountSVG color="#0033E6E5" />
      )}
      <View className="flex-row items-center justify-center gap-2">
        <Text className="text-[#0033e6e6] text-base font-semibold px-3 py-1 rounded-full">
          {[
            (benefits?.offerPercentage ?? 0) > 0 &&
              `Get Flat ${benefits?.offerPercentage}% OFF`,
            (benefits?.uptoAmount ?? 0) > 0 &&
              `Get free ${
                category === 'PRODUCTS' ? 'products' : 'services'
              } upto ₹${formatNumber(benefits?.uptoAmount ?? 0)}`,
          ]
            .filter(Boolean)
            .join(' ')}
        </Text>
      </View>
    </View>
  );
});

const OfferingItem = memo(({offering, index, expandedIndex, onToggle}) => (
  <TouchableOpacity
    onPress={() => {
      LayoutAnimation.easeInEaseOut();
      onToggle(index);
    }}
    activeOpacity={0.8}
    className="flex-col bg-white p-4 rounded-xl">
    <View className="flex-row items-center gap-2 justify-between">
      <View className="flex-row flex-1 items-center gap-2">
        <Icons.WorkspacePremiumIcon width={18} height={18} />
        <Text className="font-medium flex-1 text-md text-[#9C2CF3]">
          {offering?.name}
        </Text>
      </View>
      <View className="w-8 h-8 justify-center items-center">
        {expandedIndex === index ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
      </View>
    </View>
    {expandedIndex === index && (
      <View className="flex-col gap-2 mt-2">
        <Text className="text-md text-neutral-800 font-medium">
          {offering?.description}
        </Text>
      </View>
    )}
  </TouchableOpacity>
));

const CollabBenefits = memo(({benefits, category, offerings, allowedGuests}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleExpansion = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <View className="flex-1 flex-col gap-5">
      <OfferBadge benefits={benefits} category={category} />

      {offerings && offerings?.length > 0 ? (
        offerings?.map((offering, index) => (
          <OfferingItem
            key={index}
            offering={offering}
            index={index}
            expandedIndex={expandedIndex}
            onToggle={toggleExpansion}
          />
        ))
      ) : (
        <View className="flex-row items-center gap-2">
          <Text className="text-md text-neutral-800 font-medium">
            Enjoy All Services For Free
          </Text>
        </View>
      )}
      {!!allowedGuests && (
        <View className="flex-row items-center gap-2 justify-between bg-white p-4 rounded-xl rounded-xl">
          <View className="flex-row items-center gap-2">
            <Icons.WorkspacePremiumIcon width={18} height={18} />
            <Text className="font-medium text-md text-[#9C2CF3]">
              Guest allowed
            </Text>
          </View>
          <View className="bg-[#E1E7FF] px-2 py-1 rounded-lg">
            <Text className="font-medium text-md text-[#1946E7]">
              {allowedGuests}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
});

const CampaignBenefits = memo(({benefits, category, offerings, allowedGuests}) => {
  const isProductCategory =
    category?.toUpperCase() === 'PRODUCTS' && Array.isArray(offerings);
  if (isProductCategory) {
    return (
      <View>
        <Text>Product Category</Text>
      </View>
    );
  }

  return (
    <View className="rounded-lg overflow-hidden">
      <LinearGradient
        key={benefits?.isAmtLimit}
        colors={[
          'rgba(0, 229, 255, 0.12)',
          'rgba(198, 210, 236, 0.12)',
          'rgba(101, 31, 255, 0.12)',
          'rgba(255, 64, 129, 0.12)',
        ]}
        locations={[0.0, 0.0926, 0.6909, 1.0]}
        start={{x: 0.1, y: 0.9}}
        end={{x: 0.9, y: 0.1}}
        style={styles.gradient}>
        <View className="p-5 flex-1 flex-col gap-5">
          <View className="flex-col gap-5">
            <View className="flex-row items-center justify-between gap-2">
              <View className="flex-row items-center gap-2">
                <BenefitsSVG />
                <Text className="text-xl font-medium text-neutral-800">
                  Collab Benefits
                </Text>
              </View>
              {benefits?.stayDuration &&
                (benefits.stayDuration.days ?? 0) > 0 &&
                (benefits.stayDuration.nights ?? 0) > 0 && (
                  <StayDurationBadge stayDuration={benefits?.stayDuration} />
                )}
            </View>
          </View>
          {benefits && (
            <CollabBenefits
              benefits={benefits}
              category={category}
              allowedGuests={allowedGuests}
              offerings={offerings}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
});

export default CampaignBenefits;

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#0033E633',
  },
});
