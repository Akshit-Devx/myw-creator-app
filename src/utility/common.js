import {Icons} from '../assets/icons';
import {
  RAZORPAY_ANNUAL_PLAN_ID,
  RAZORPAY_MONTHLY_PLAN_ID,
} from '../config/envConfig';
import {getMediaURL} from './helper';
import {
  LinkIcon,
  SaveIcon,
  SendIcon,
  ShieldIcon,
  UnlockIcon,
  DiamondIcon,
  HandshakeIcon,
} from './icons';

export const CAMPAIGN_CATEGORIES_LIST = ['RESTAURANTS', 'SALONS', 'RESORTS'];

export const CAMPAIGN_CATEGORIES = [
  {
    id: 'TRENDING',
    label: 'Trending',
    icon: Icons.ExploreIcon,
  },
  {
    id: 'FOR_YOU',
    label: 'For You',
    icon: Icons.ForYouIcon,
  },
  {
    id: 'PRODUCTS',
    label: 'Products',
    icon: Icons.ProductionSectionIcon,
  },
  {
    id: 'HOTELS',
    label: 'Hotels',
    icon: Icons.HotelIcon,
  },
  {
    id: 'SALONS',
    label: 'Salons',
    icon: Icons.SalonIcon,
  },
  {
    id: 'RESTAURANTS',
    label: 'Restaurants',
    icon: Icons.RestaurantIcon,
  },
];

export const CAMPAIGN_TYPES_TAB = [
  {label: 'Collab', value: 'BARTER'},
  {label: 'Offers', value: 'OFFER'},
];

export const CAMPAIGN_TYPES = {
  SALONS: 'SALONS',
  RESTAURANTS: 'RESTAURANTS',
  RESORTS: 'RESORTS',
  PRODUCTS: 'PRODUCTS',
};

export const PLATFORMS = {
  INSTAGRAM: 'INSTAGRAM',
};

export const MESSAGES = {
  ALREADY_APPLIED: 'ALREADY_APPLIED',
  ELIGIBLE_FROM_SUGGESTION: 'ELIGIBLE_FROM_SUGGESTION',
  ELIGIBLE_FROM_INVITATION: 'ELIGIBLE_FROM_INVITATION',
};

export const REFS = {
  SUGGESTIONS: 'SUGGESTIONS',
  INVITE_LINK: 'INVITE_LINK',
};

export const STATUSES = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
};

export const CAMPAIGN_DETAILS_TABS = ['ABOUT', 'PHOTOS'];

export const PAYOUT_METHOD = ['BANK', 'UPI'];

export const categoryList = [
  'Fashion',
  'Lifestyle',
  'Food',
  'Beauty',
  'Skincare',
  'Travel',
  'Technology',
  'Vloggers',
  'Health ',
  'Fitness',
  'Gaming',
  'Finance',
  'Automobile',
  'Photography',
];

export const tagOptions = [
  'UGC',
  'Product Review',
  'Try-On Haul',
  'Unboxing',
  'Tutorial / Demo',
  'Giveaway Collaboration',
  'Discount Code Promotion',
  'Event Coverage',
  'Brand Ambassadorship',
  'Testimonial / Feedback',
  'Product Usage Reel',
  'Shoppable Link Promo',
  'Affiliate Collab',
  'Sponsored Post',
  'Story Mention',
  'Reel Collaboration',
  'Long-form Video',
  'Before/After Content',
  'Voiceover Reel',

  // Fashion
  'Streetwear',
  'Ethnic / Traditional',
  'Luxury Fashion',
  'Daily Wear',
  'Accessories (Bags / Watches)',
  'Footwear',

  // Beauty
  'Makeup Tutorials',
  'Skincare Routines',
  'Haircare',
  'Nail Art',
  'DIY Beauty',

  // Food
  'Recipe Videos',
  'Street Food',
  'Restaurant / Cafe Reviews',
  'Home Cooking',
  'Food Challenges',

  // Travel
  'Solo Travel',
  'Couple Travel',
  'Luxury Travel',
  'Budget Travel',
  'Resort / Hotel Reviews',
  'Local Experiences',

  // Finance / Tech
  'Stock Market',
  'Crypto',
  'Investing',
  'App Review',
];

export const campaignsPlans = {
  monthly: {
    planId: RAZORPAY_MONTHLY_PLAN_ID,
    name: 'Pro',
    description:
      'For content creators and businesses Advanced analytics, automatic embeds.',
    price: '299',
    recurring: 'month',
    count: '360',
    features: [
      {
        label: 'Access 5000+ Hotels, Salons & Restaurant Collabs',
        icon: <UnlockIcon size={30} />,
      },
      {
        label: 'Link-in-Bio Mini Website (Your Creator Portfolio)',
        icon: <LinkIcon size={30} />,
      },
      {
        label: 'Auto-DM Tool to Impress Brands Instantly',
        icon: <SendIcon size={30} />,
      },
      {
        label: 'Unlimited Offers & Savings',
        icon: <SaveIcon size={30} />,
      },
      {
        label: 'No Commitments – Cancel Anytime',
        icon: <ShieldIcon size={30} />,
      },
      {
        label: 'No extra or hidden charges',
        icon: <HandshakeIcon size={30} />,
      },
      {
        label:
          'Access to All Future Upgrades (Paid Campaigns, UGC Deals Included)',
        icon: <DiamondIcon size={30} />,
      },
    ],
  },
  yearly: {
    planId: RAZORPAY_ANNUAL_PLAN_ID,
    name: 'Pro',
    description:
      'For content creators and businesses Advanced analytics, automatic embeds.',
    price: '2999',
    recurring: 'year',
    count: '30',
    features: [
      {
        label: 'Access 5000+ Hotels, Salons & Restaurant Collabs',
        icon: <UnlockIcon size={30} />,
      },
      {
        label: 'Link-in-Bio Mini Website (Your Creator Portfolio)',
        icon: <LinkIcon size={30} />,
      },
      {
        label: 'Auto-DM Tool to Impress Brands Instantly',
        icon: <SendIcon size={30} />,
      },
      {
        label: 'Unlimited Offers & Savings',
        icon: <SaveIcon size={30} />,
      },
      {
        label: 'No Commitments – Cancel Anytime',
        icon: <ShieldIcon size={30} />,
      },
      {
        label: 'No extra or hidden charges',
        icon: <HandshakeIcon size={30} />,
      },
      {
        label:
          'Access to All Future Upgrades (Paid Campaigns, UGC Deals Included)',
        icon: <DiamondIcon size={30} />,
      },
    ],
  },
};

export const cityOptions = [
  {label: 'Delhi NCR', value: 'delhi-ncr'},
  {label: 'Mumbai', value: 'mumbai'},
  {label: 'Pune', value: 'pune'},
  {label: 'Bengaluru', value: 'bengaluru'},
  {label: 'Hyderabad', value: 'hyderabad'},
  {label: 'Jaipur', value: 'jaipur'},
  {label: 'Surat', value: 'surat'},
  {label: 'Ahmedabad', value: 'ahmedabad'},
  {label: 'Chandigarh', value: 'chandigarh'},
  {label: 'Mohali', value: 'mohali'},
  {label: 'Panchkula', value: 'panchkula'},
  {label: 'Lucknow', value: 'lucknow'},
  {label: 'Goa', value: 'goa'},
  {label: 'Chennai', value: 'chennai'},
  {label: 'Kolkata', value: 'kolkata'},
  {label: 'Nagpur', value: 'nagpur'},
  {label: 'Indore', value: 'indore'},
  {label: 'Bhopal', value: 'bhopal'},
  {label: 'Ludhiana', value: 'ludhiana'},
  {label: 'Vadodara', value: 'vadodara'},
  {label: 'Nashik', value: 'nashik'},
  {label: 'Faridabad', value: 'faridabad'},
  {label: 'Rajkot', value: 'rajkot'},
  {label: 'Agra', value: 'agra'},
  {label: 'Varanasi', value: 'varanasi'},
  {label: 'Coimbatore', value: 'coimbatore'},
  {label: 'Jodhpur', value: 'jodhpur'},
  {label: 'Dehradun', value: 'dehradun'},
  {label: 'Noida', value: 'noida'},
  {label: 'Ghaziabad', value: 'ghaziabad'},
  {label: 'Udaipur', value: 'udaipur'},
  {label: 'Aurangabad', value: 'aurangabad'},
  {label: 'Jammu', value: 'jammu'},
  {label: 'Raipur', value: 'raipur'},
  {label: 'Srinagar', value: 'srinagar'},
  {label: 'Siliguri', value: 'siliguri'},
  {label: 'Rishikesh', value: 'rishikesh'},
  {label: 'Manali', value: 'manali'},
  {label: 'Kochi', value: 'kochi'},
  {label: 'Munnar', value: 'munnar'},
  {label: 'Shillong', value: 'shillong'},
  {label: 'Port Blair', value: 'port-blair'},
];

export const allStateOptions = [
  {label: 'Assam', value: 'assam'},
  {label: 'Bihar', value: 'bihar'},
  {label: 'Chhattisgarh', value: 'chhattisgarh'},
  {label: 'Goa', value: 'goa'},
  {label: 'Gujarat', value: 'gujarat'},
  {label: 'Haryana', value: 'haryana'},
  {label: 'Himachal Pradesh', value: 'himachal pradesh'},
  {label: 'Jharkhand', value: 'jharkhand'},
  {label: 'Karnataka', value: 'karnataka'},
  {label: 'Kerala', value: 'kerala'},
  {label: 'Madhya Pradesh', value: 'madhya pradesh'},
  {label: 'Maharashtra', value: 'maharashtra'},
  {label: 'Manipur', value: 'manipur'},
  {label: 'Odisha', value: 'odisha'},
  {label: 'Punjab', value: 'punjab'},
  {label: 'Rajasthan', value: 'rajasthan'},
  {label: 'Sikkim', value: 'sikkim'},
  {label: 'Tamil Nadu', value: 'tamil nadu'},
  {label: 'Telangana', value: 'telangana'},
  {label: 'Uttar Pradesh', value: 'uttar pradesh'},
  {label: 'Uttarakhand', value: 'uttarakhand'},
  {label: 'West Bengal', value: 'west bengal'},
  {
    label: 'Andaman and Nicobar Islands',
    value: 'andaman and nicobar islands',
  },
  {label: 'Chandigarh', value: 'chandigarh'},
  {label: 'Delhi', value: 'delhi'},
  {label: 'Jammu and Kashmir', value: 'jammu and kashmir'},
  {label: 'Ladakh', value: 'ladakh'},
  {label: 'Lakshadweep', value: 'lakshadweep'},
];

export const productCategories = [
  {
    id: 1,
    name: 'Fashion',
    category: 'fashion',
    image: getMediaURL('public/static-assets/fashion.png'),
  },
  // {
  //   id: 2,
  //   name: "Home decor",
  //   category: "home-decor",
  //   image: getMediaURL("public/static-assets/home-decor.png"),
  // },
  // {
  //   id: 3,
  //   name: "Health & Fitness",
  //   category: "health-fitness",
  //   image: getMediaURL("public/static-assets/fitness.png"),
  // },
  // {
  //   id: 4,
  //   name: "Lifestyle",
  //   category: "lifestyle",
  //   image: getMediaURL("public/static-assets/lifestyle.png"),
  // },
  {
    id: 2,
    name: 'Electronics',
    category: 'electronics',
    image: getMediaURL('public/static-assets/electronics.png'),
  },
  {
    id: 3,
    name: 'Beauty & Skin Care',
    category: 'beauty-skin-care',
    image: getMediaURL('public/static-assets/beauty.png'),
  },
];
