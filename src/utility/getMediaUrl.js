// import {BRANDS_MEDIA_URL} from '@/config/envConfig';

export const getMediaUrl = key => {
  const BRANDS_MEDIA_URL = '';
  return `https://${BRANDS_MEDIA_URL}/${key}?optimizer=image`;
};
