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

export const convertToTitleCase = text => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getMediaTypeFromPath = path => {
  if (!path) {
    return null;
  }
  const lowercasePath = path.toLowerCase();

  const videoExtensions = [
    '.mp4',
    '.webm',
    '.ogg',
    '.mov',
    '.avi',
    '.wmv',
    '.flv',
    '.mkv',
    '.m4v',
  ];
  const isVideo = videoExtensions.some(ext => lowercasePath.endsWith(ext));

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.svg',
    '.tiff',
    '.ico',
  ];
  const isImage = imageExtensions.some(ext => lowercasePath.endsWith(ext));

  if (isVideo) {
    return 'video';
  }
  if (isImage) {
    return 'image';
  }

  if (lowercasePath.includes('video') || lowercasePath.includes('mp4')) {
    return 'video';
  }
  if (lowercasePath.includes('image') || lowercasePath.includes('photo')) {
    return 'image';
  }

  return 'image';
};

export const getMaxOfferPercentage = requirements => {
  if (!requirements || requirements.length === 0) {
    return 0;
  }

  let maxOffer = 0;

  for (const requirement of requirements) {
    const creatorTypes = requirement.creatorType || [];
    for (const creator of creatorTypes) {
      if (typeof creator.offerPercentage === 'number') {
        maxOffer = Math.max(maxOffer, creator.offerPercentage);
      }
    }
  }

  return maxOffer;
};

export const getLowestMinFollowers = requirements => {
  if (!requirements || requirements.length === 0) {
    return 0;
  }

  let minFollowers = Infinity;

  for (const requirement of requirements) {
    const creatorTypes = requirement.creatorType || [];
    for (const creator of creatorTypes) {
      if (typeof creator.minFollowers === 'number') {
        minFollowers = Math.min(minFollowers, creator.minFollowers);
      }
    }
  }

  return minFollowers === Infinity ? 0 : minFollowers;
};

export function formatNumber(value) {
  if (value < 1000) return value?.toString();

  if (value < 1000000) {
    const formatted = (value / 1000)?.toFixed(1);
    return formatted?.endsWith('.0')
      ? `${formatted?.slice(0, -2)}K`
      : `${formatted}k`;
  }

  if (value < 1000000000) {
    const formatted = (value / 1000000)?.toFixed(1);
    return formatted?.endsWith('.0')
      ? `${formatted?.slice(0, -2)}M`
      : `${formatted}M`;
  }

  const formatted = (value / 1000000000)?.toFixed(1);
  return formatted?.endsWith('.0')
    ? `${formatted?.slice(0, -2)}B`
    : `${formatted}B`;
}

export const getMaxUptoAmount = requirements => {
  if (!requirements || requirements.length === 0) return 0;

  let maxAmount = 0;

  for (const requirement of requirements) {
    const creatorTypes = requirement.creatorType || [];
    for (const creator of creatorTypes) {
      if (typeof creator.uptoAmount === 'number') {
        maxAmount = Math.max(maxAmount, creator.uptoAmount);
      }
    }
  }

  return maxAmount;
};
