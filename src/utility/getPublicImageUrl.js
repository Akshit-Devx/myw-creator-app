// import {MEDIA_URL} from '@/config/envConfig';

export const getPublicURL = (key, resize) => {
  let MEDIA_URL = '';
  if (resize)
    return `https://${MEDIA_URL}/${key}?resize=${resize}?optimizer=image`;
  return `https://${MEDIA_URL}/${key}?optimizer=image`;
};
