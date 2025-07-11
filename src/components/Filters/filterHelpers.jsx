// Filter logic and types extracted from Filters/index.tsx
import {
  resortCategoryOptions,
  restaurantCategoryOptions,
  salonCategoryOptions,
  productCategoryOptions,
  resortStateOptions,
  restaurantStateOptions,
  salonStateOptions,
  productFollowerRangeOptions,
  resortFollowerRangeOptions,
  restaurantFollowerRangeOptions,
  categoryOptions,
} from './filterOptions';
import {formatNumber} from '../../utility/helper';
import {Text, View} from 'react-native';

export function getCategoryFilterOptions(category) {
  switch (category) {
    case 'RESORTS':
      return {
        stateOptions: resortStateOptions,
        categoryOptions: resortCategoryOptions,
        followerRangeOptions: resortFollowerRangeOptions,
      };
    case 'RESTAURANTS':
      return {
        stateOptions: restaurantStateOptions,
        categoryOptions: restaurantCategoryOptions,
        followerRangeOptions: restaurantFollowerRangeOptions,
      };
    case 'SALONS':
      return {
        stateOptions: salonStateOptions,
        categoryOptions: salonCategoryOptions,
        followerRangeOptions: [
          {
            label: '1K - 20K',
            value: {minFollowers: 1000, maxFollowers: 20000},
          },
          {
            label: '20K - 50K',
            value: {minFollowers: 20000, maxFollowers: 50000},
          },
          {label: '50K+', value: {minFollowers: 50000}},
        ],
      };
    case 'PRODUCTS':
      return {
        categoryOptions: productCategoryOptions,
        followerRangeOptions: productFollowerRangeOptions,
      };
    default:
      return {
        stateOptions: [],
        categoryOptions: categoryOptions.hotel,
        followerRangeOptions: [
          {
            label: '1K - 20K',
            value: {minFollowers: 1000, maxFollowers: 20000},
          },
          {
            label: '20K - 50K',
            value: {minFollowers: 20000, maxFollowers: 50000},
          },
          {label: '50K+', value: {minFollowers: 50000}},
        ],
      };
  }
}

export const formatFilterDisplay = filter => {
  const {displayKey, value, prefix} = filter;

  const FilterText = ({children}) => (
    <View className="flex-row items-center gap-1">
      {prefix}
      <Text className="text-sm capitalize text-gray-700">{children}</Text>
    </View>
  );

  if (
    displayKey === 'Fast Approval' ||
    displayKey === 'Negotiable' ||
    displayKey === 'Automatic Request Approval'
  ) {
    return <FilterText>{displayKey}</FilterText>;
  }

  if (value) {
    switch (displayKey) {
      case 'Followers': {
        let followersText = '';
        if (value.includes('-')) {
          const [min, max] = value.split('-');
          followersText = `${formatNumber(Number(min))} - ${formatNumber(
            Number(max),
          )} followers`;
        } else if (value.includes('+')) {
          const min = value.replace('+', '');
          followersText = `${formatNumber(Number(min))}+ followers`;
        } else if (value.includes('<')) {
          const max = value.replace('<', '');
          followersText = `Under ${formatNumber(Number(max))} followers`;
        } else {
          followersText = `${formatNumber(Number(value))} followers`;
        }

        return <FilterText>{followersText}</FilterText>;
      }

      case 'Offer':
        return <FilterText>{value} discount</FilterText>;

      case 'City':
      case 'Categories':
      case 'Upto Amount':
      case 'Guests':
      case 'State':
        return <FilterText>{value}</FilterText>;

      case 'Sort By': {
        const sortLabels = {
          createdAt_desc: 'Newest First',
          createdAt_asc: 'Oldest First',
          minFollowers_asc: 'Followers: Low to High',
          campaignScore: 'Best Match',
        };
        return <FilterText>{sortLabels[value] || value}</FilterText>;
      }

      default:
        return <FilterText>{`${displayKey}: ${value}`}</FilterText>;
    }
  }

  return <FilterText>{displayKey}</FilterText>;
};
