import Config from 'react-native-config';

export const getBrandMediaURL = key => {
  return `${Config.BRAND_MEDIA_URL}/${key}`;
};

export const getInfluencerMediaURL = key => {
  return `${Config.INFLUENCER_MEDIA_URL}/${key}`;
};
