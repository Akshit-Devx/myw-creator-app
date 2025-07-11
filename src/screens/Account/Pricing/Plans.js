import Config from 'react-native-config';

export const campaignsPlans = {
  monthly: {
    planId: Config.RAZORPAY_MONTHLY_PLAN_ID,
    name: 'Pro',
    description:
      'For content creators and businesses Advanced analytics, automatic embeds.',
    price: '299',
    recurring: 'month',
    count: '360',
    features: [
      {
        label: 'Access 5000+ Hotels, Salons & Restaurant Collabs',
        // icon: <UnlockIcon size={32} />,
      },
      {
        label: 'Link-in-Bio Mini Website (Your Creator Portfolio)',
        // icon: <LinkIcon size={30} />,
      },
      {
        label: 'Auto-DM Tool to Impress Brands Instantly',
        // icon: <SendIcon size={30} />,
      },
      {
        label: 'Unlimited Offers & Savings',
        // icon: <SaveIcon size={26} />,
      },
      {
        label: 'No Commitments – Cancel Anytime',
        // icon: <ShieldIcon size={26} />,
      },
      {
        label: 'No extra or hidden charges',
        // icon: <HandshakeIcon size={26} />,
      },
      {
        label:
          'Access to All Future Upgrades (Paid Campaigns, UGC Deals Included)',
        // icon: <DiamondIcon size={44} />,
      },
    ],
  },
  yearly: {
    planId: Config.RAZORPAY_ANNUAL_PLAN_ID,
    name: 'Pro',
    description:
      'For content creators and businesses Advanced analytics, automatic embeds.',
    price: '2999',
    recurring: 'year',
    count: '30',
    features: [
      {
        label: 'Access 5000+ Hotels, Salons & Restaurant Collabs',
        // icon: <UnlockIcon size={32} />,
      },
      {
        label: 'Link-in-Bio Mini Website (Your Creator Portfolio)',
        // icon: <LinkIcon size={30} />,
      },
      {
        label: 'Auto-DM Tool to Impress Brands Instantly',
        // icon: <SendIcon size={30} />,
      },
      {
        label: 'Unlimited Offers & Savings',
        // icon: <SaveIcon size={26} />,
      },
      {
        label: 'No Commitments – Cancel Anytime',
        // icon: <ShieldIcon size={26} />,
      },
      {
        label: 'No extra or hidden charges',
        // icon: <HandshakeIcon size={26} />,
      },
      {
        label:
          'Access to All Future Upgrades (Paid Campaigns, UGC Deals Included)',
        // icon: <DiamondIcon size={44} />,
      },
    ],
  },
};
