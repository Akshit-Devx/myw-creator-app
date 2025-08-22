import {Icons} from '../assets/icons';
import {
  RAZORPAY_ANNUAL_PLAN_ID,
  RAZORPAY_MONTHLY_PLAN_ID,
} from '../config/envConfig';
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

export const CAMPAIGN_TYPES = ['BARTER', 'OFFER'];

export const CAMPAIGN_DETAILS_TABS = ['ABOUT', 'PHOTOS', 'REFERENCES'];

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
