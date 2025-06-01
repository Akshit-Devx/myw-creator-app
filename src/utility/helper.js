import Config from 'react-native-config';

export const getBrandMediaURL = key => {
  return `${Config.BRAND_MEDIA_URL}/${key}`;
};

export const getInfluencerMediaURL = key => {
  return `${Config.INFLUENCER_MEDIA_URL}/${key}`;
};

export const formatPhoneNumber = input => {
  // Remove any spaces
  const digitsOnly = input.replace(/\s+/g, '');
  // Prepend +91
  return `+91${digitsOnly}`;
};

export const generateTempPassword = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$?';
  let password = '';

  // Generate a password that meets AWS Cognito requirements:
  // At least 8 characters, with uppercase, lowercase, numbers, and special chars
  password += chars.charAt(Math.floor(Math.random() * 26)); // One uppercase
  password += chars.charAt(26 + Math.floor(Math.random() * 26)); // One lowercase
  password += chars.charAt(52 + Math.floor(Math.random() * 10)); // One number
  password += chars.charAt(62 + Math.floor(Math.random() * 4)); // One special char

  // Add more random characters to reach at least 8 chars
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
