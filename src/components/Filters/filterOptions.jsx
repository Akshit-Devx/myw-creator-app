import {Text, View} from 'react-native';
import {Icons} from '../../assets/icons';

export const BARTER = 'Collabs';
export const OFFER = 'Offers';

export const barterNavTabs = [
  {
    label: (
      <View className="flex-row ">
        <Icons.NoExtraCost height={16} width={16} />
        <Text className="text-sm font-medium ml-2">Min. 5k OFF</Text>
      </View>
    ),
    key: 'uptoAmount-5000',
    value: 5000,
  },
  {
    label: (
      //   {/* <FastApprovalSVG color="#1946E7" />

      <View className="flex-row ">
        <Icons.Negotiation height={16} width={16} />
        <Text className="text-sm font-medium ml-2 text-[#1946E7]">
          Fast Approval
        </Text>
      </View>
    ),
    key: 'hasFastApproval-true',
    value: true,
  },
  {
    label: (
      <View className="flex-row ">
        <Icons.Negotiation height={16} width={16} />
        <Text className="text-sm font-medium ml-2">Negotiable</Text>
      </View>
    ),
    key: 'isNegotiable-true',
    value: true,
  },
];

export const offerNavTabs = [
  {
    label: (
      <>
        {/* <DiscountSVG /> <p>+50% OFF</p> */}
        <Text>+50% OFF</Text>
      </>
    ),
    key: 'offerPercentage-50',
    value: 50,
  },
  {
    label: (
      <>
        {/* <FastApprovalSVG color="#1946E7" />
        <p style={{color: '#1946E7'}}>Fast Approval</p> */}
        <Text>+50% OFF</Text>
      </>
    ),
    key: 'hasFastApproval-true',
    value: true,
  },
  {
    label: (
      <>
        {/* <NegotiationSVG /> <p>Negotiable</p> */}
        <Icons.Negotiation height={16} width={16} />
        <Text>+50% OFF</Text>
      </>
    ),
    key: 'isNegotiable-true',
    value: true,
  },
];

export const categoryOptions = {
  hotel: [
    {label: 'Beach', value: 'beach'},
    {label: 'Boutique', value: 'boutique'},
    {label: 'Budget', value: 'budget'},
    {label: 'Couple', value: 'couple'},
    {label: 'Eco-friendly', value: 'eco-friendly'},
    {label: 'Family', value: 'family'},
    {label: 'Heritage', value: 'heritage'},
    {label: 'Hill', value: 'hill'},
    {label: 'Hotel', value: 'hotel'},
    {label: 'Leisure', value: 'leisure'},
    {label: 'Luxury', value: 'luxury'},
    {label: 'Mountain', value: 'mountain'},
    {label: 'Nature', value: 'nature'},
    {label: 'Premium', value: 'premium'},
    {label: 'Private-pool', value: 'private-pool'},
    {label: 'Resort', value: 'resort'},
    {label: 'Scenic', value: 'scenic'},
    {label: 'Stay', value: 'stay'},
    {label: 'Staycation', value: 'staycation'},
    {label: 'Urban', value: 'urban'},
    {label: 'Villa', value: 'villa'},
    {label: 'Weekend', value: 'weekend'},
  ],
  restaurant: [
    {label: 'Bar', value: 'bar'},
    {label: 'Bistro', value: 'bistro'},
    {label: 'Buffet', value: 'buffet'},
    {label: 'Cafe', value: 'cafe'},
    {label: 'Casual', value: 'casual'},
    {label: 'Continental', value: 'continental'},
    {label: 'Cuisine', value: 'cuisine'},
    {label: 'Dining', value: 'dining'},
    {label: 'Family', value: 'family-restaurant'},
    {label: 'Fast-food', value: 'fast-food'},
    {label: 'Fine-dine', value: 'fine-dine'},
    {label: 'Live-music', value: 'live-music'},
    {label: 'Local', value: 'local'},
    {label: 'Lounge', value: 'lounge'},
    {label: 'Multi-cuisine', value: 'multi-cuisine'},
    {label: 'Non-veg', value: 'non-veg'},
    {label: 'Open-air', value: 'open-air'},
    {label: 'Pub', value: 'pub'},
    {label: 'Romantic', value: 'romantic'},
    {label: 'Rooftop', value: 'rooftop'},
    {label: 'Street-food', value: 'street-food'},
    {label: 'Veg', value: 'veg'},
  ],
  salon: [
    {label: 'Ayurvedic', value: 'ayurvedic'},
    {label: 'Beard', value: 'beard'},
    {label: 'Beauty', value: 'beauty'},
    {label: 'Bridal', value: 'bridal'},
    {label: 'Coloring', value: 'coloring'},
    {label: 'Facial', value: 'facial'},
    {label: 'Grooming', value: 'grooming'},
    {label: 'Hair', value: 'hair'},
    {label: 'Kids', value: 'kids'},
    {label: 'Luxury', value: 'luxury-salon'},
    {label: 'Makeup', value: 'makeup'},
    {label: 'Massage', value: 'massage'},
    {label: 'Men', value: 'men'},
    {label: 'Nails', value: 'nails'},
    {label: 'Organic', value: 'organic'},
    {label: 'Skin', value: 'skin'},
    {label: 'Spa', value: 'spa'},
    {label: 'Styling', value: 'styling'},
    {label: 'Trendy', value: 'trendy'},
    {label: 'Unisex', value: 'unisex'},
    {label: 'Wellness', value: 'wellness'},
    {label: 'Women', value: 'women'},
  ],
};

export const resortCategoryOptions = [
  {label: 'Villas', value: 'villas'},
  {label: 'Resorts', value: 'resorts'},
  {label: 'Apartments', value: 'apartments'},
];

export const restaurantCategoryOptions = [
  {label: 'Cafe', value: 'cafe'},
  {label: 'Food Court', value: 'food-court'},
];

export const salonCategoryOptions = [
  {label: 'Unisex', value: 'unisex'},
  {label: 'Women', value: 'women'},
];

export const productCategoryOptions = [
  {label: 'Fashion', value: 'fashion'},
  {label: 'Electronics', value: 'electronics'},
  {label: 'Beauty & Skin Care', value: 'beauty & skin care'},
  {label: 'Lifestyle ', value: 'lifestyle'},
  {label: 'Health & Fitness', value: 'health & fitness'},
];

export const resortStateOptions = [
  {label: 'New Delhi', value: 'delhi'},
  {label: 'Uttarakhand', value: 'uttarakhand'},
  {label: 'Himachal Pradesh', value: 'himachal pradesh'},
  {label: 'Maharashtra', value: 'maharashtra'},
  {label: 'Goa', value: 'goa'},
];

export const restaurantStateOptions = [
  {label: 'New Delhi', value: 'delhi'},
  {label: 'Karnataka', value: 'karnataka'},
  {label: 'Haryana', value: 'haryana'},
  {label: 'Maharashtra', value: 'maharashtra'},
  {label: 'Rajasthan', value: 'rajasthan'},
];

export const salonStateOptions = [
  {label: 'Maharashtra', value: 'maharashtra'},
  {label: 'New Delhi', value: 'delhi'},
  {label: 'Gujarat', value: 'gujarat'},
  {label: 'Haryana', value: 'haryana'},
  {label: 'Uttar Pradesh', value: 'uttar pradesh'},
];

export const productFollowerRangeOptions = [
  {label: '1K - 20K', value: {minFollowers: 1000, maxFollowers: 20000}},
  {label: '20K - 50K', value: {minFollowers: 20000, maxFollowers: 50000}},
  {label: '50K+', value: {minFollowers: 50000}},
];

export const resortFollowerRangeOptions = [
  {label: '1K - 20K', value: {minFollowers: 1000, maxFollowers: 20000}},
  {label: '20K - 50K', value: {minFollowers: 20000, maxFollowers: 50000}},
  {label: '50K+', value: {minFollowers: 50000}},
];

export const restaurantFollowerRangeOptions = [
  {label: '1K - 20K', value: {minFollowers: 1000, maxFollowers: 20000}},
  {label: '20K - 50K', value: {minFollowers: 20000, maxFollowers: 50000}},
  {label: '50K+', value: {minFollowers: 50000}},
];

export const FILTER_CONFIG = {
  followers: {
    key: 'Followers',
    format: value => (Array.isArray(value) ? value.join('-') : value),
    prefix: <Icons.FollowersFilterSVG />,
  },
  offer: {
    key: 'Offer',
    format: value => `${Array.isArray(value) ? value[0] : value}%+`,
    // prefix: <DiscountSVG />,
    prefix: <Icons.AutoDM />,
  },
  city: {
    key: 'City',
    format: value => (Array.isArray(value) ? value[0] : value),
    // prefix: <LocationSVG size={16} />,
    prefix: <Icons.AutoDM />,
  },
  categories: {
    key: 'Categories',
    format: value => (Array.isArray(value) ? value.join(', ') : value),
    prefix: '🏷️',
  },
  uptoAmount: {
    key: 'Upto Amount',
    format: value => `₹${Array.isArray(value) ? value[0] : value}`,
    // prefix: <UpTrendLineSVG />,
    prefix: <Icons.AutoDM />,
  },
  hasFastApproval: {
    key: 'Fast Approval',
    format: () => '',
    // prefix: <FastApprovalSVG />,
    prefix: <Icons.AutoDM />,
  },
  isNegotiable: {
    key: 'Negotiable',
    format: () => '',
    prefix: <Icons.Negotiation />,
  },
  autoRequestApproval: {
    key: 'Automatic Request Approval',
    format: () => '',
    // prefix: <FastApprovalSVG />,
    prefix: <Icons.AutoDM />,
  },
  allowedGuests: {
    key: 'Guests',
    format: value => `${Array.isArray(value) ? value[0] : value} guests`,
    // prefix: <UserSVG />,
    prefix: <Icons.AutoDM />,
  },
  state: {
    key: 'State',
    format: value => (Array.isArray(value) ? value[0] : value),
    // prefix: <LocationSVG size={16} />,
    prefix: <Icons.AutoDM />,
  },
  sortBy: {
    key: 'Sort By',
    format: value => (Array.isArray(value) ? value[0] : value),
    // prefix: <UpTrendLineSVG />,
    prefix: <Icons.AutoDM />,
  },
};

export const SORT_OPTIONS = [
  {label: 'Popularity', value: 'campaignScore_desc'},
  {label: 'Newest First', value: 'createdAt_desc'},
  {label: 'Oldest First', value: 'createdAt_asc'},
  {label: 'Followers: Low to High', value: 'minFollowers_asc'},
  {label: 'Followers: High to Low', value: 'minFollowers_desc'},
];

export const QUICK_FOLLOWER_OPTIONS = [
  {value: 1000, label: '1k+'},
  {value: 10000, label: '10k+'},
  {value: 100000, label: '100k+'},
  {value: 1000000, label: '1M+'},
];

// export const QUICK_OFFER_OPTIONS = [
//   {value: 30, label: '30%+', icon: DiscountSVG},
//   {value: 50, label: '50%+', icon: DiscountSVG},
//   {value: 80, label: '80%+', icon: DiscountSVG},
// ];

// export const QUICK_CITY_OPTIONS = [
//   {value: 'Goa', label: 'Goa', icon: GoaSVG},
//   {value: 'Mumbai', label: 'Mumbai', icon: MumbaiSVG},
//   {value: 'Shimla', label: 'Shimla', icon: ShimlaSVG},
//   {value: 'Jaipur', label: 'Jaipur', icon: JaipurSVG},
// ];

export const QUICK_OFFER_OPTIONS = [
  {value: 30, label: '30%+'},
  {value: 50, label: '50%+'},
  {value: 80, label: '80%+'},
];

export const QUICK_CITY_OPTIONS = [
  {value: 'Goa', label: 'Goa'},
  {value: 'Mumbai', label: 'Mumbai'},
  {value: 'Shimla', label: 'Shimla'},
  {value: 'Jaipur', label: 'Jaipur'},
];

export const cityOptions = [
  {label: 'Mumbai', value: 'maharashtra'},
  {label: 'Delhi', value: 'delhi'},
  {label: 'Karnataka', value: 'karnataka'},
  {label: 'Telangana', value: 'telangana'},
  {label: 'Gujarat', value: 'gujarat'},
  {label: 'Rajasthan', value: 'rajasthan'},
  {label: 'West Bengal', value: 'west bengal'},
  {label: 'Uttar Pradesh', value: 'uttar pradesh'},
  {label: 'Madhya Pradesh', value: 'madhya pradesh'},
];

export const cityToStateMap = {
  mumbai: 'maharashtra',
  pune: 'maharashtra',
  delhi: 'delhi',
  bengaluru: 'karnataka',
  hyderabad: 'telangana',
  gujrat: 'gujarat',
  rajasthan: 'rajasthan',
  kolkata: 'west bengal',
  lucknow: 'uttar pradesh',
  indore: 'madhya pradesh',
};
