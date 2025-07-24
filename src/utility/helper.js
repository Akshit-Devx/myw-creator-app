import {MEDIA_URL} from '../config/envConfig';

export const getMediaURL = key => {
  return `${MEDIA_URL}/${key}`;
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

export const getRequirementByFollowerCount = (
  campaignData,
  platform,
  followerCount,
) => {
  const count = Number(followerCount ?? 0);
  const type = campaignData?.type;
  const creatorTypes =
    campaignData?.requirements?.find(
      req => req?.platform?.toUpperCase() === platform?.toUpperCase(),
    )?.creatorType || [];

  if (!creatorTypes.length) return null;

  const inRange = creatorTypes.filter(
    ({minFollowers = 0, maxFollowers = 0}) =>
      count >= minFollowers && (maxFollowers === 0 || count <= maxFollowers),
  );

  const getBest = items =>
    items.reduce((best, curr) => {
      const bestVal =
        type === 'BARTER' ? best?.uptoAmount ?? 0 : best?.offerPercentage ?? 0;
      const currVal =
        type === 'BARTER' ? curr?.uptoAmount ?? 0 : curr?.offerPercentage ?? 0;
      return currVal > bestVal ? curr : best;
    });

  if (inRange.length > 0) return getBest(inRange);

  const lowestMin = creatorTypes.reduce((min, curr) =>
    curr.minFollowers < min.minFollowers ? curr : min,
  );

  return count < lowestMin.minFollowers ? lowestMin : getBest(creatorTypes);
};

export const convertTo12HourFormat = time24 => {
  if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) {
    return 'Invalid time format';
  }

  const [hours24, minutes] = time24.split(':').map(Number);

  // Handle invalid hours or minutes
  if (hours24 > 23 || minutes > 59) {
    return 'Invalid time';
  }

  // Special case for midnight (00:00)
  if (hours24 === 0) {
    return `12:${minutes.toString().padStart(2, '0')} AM`;
  }

  // Special case for noon (12:00)
  if (hours24 === 12) {
    return `12:${minutes.toString().padStart(2, '0')} PM`;
  }

  // Convert to 12-hour format
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24;

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const generateUUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (char) {
      const rand = (Math.random() * 16) | 0;
      const value = char === 'x' ? rand : (rand & 0x3) | 0x8;
      return value.toString(16);
    },
  );
};

export const formatDate = isoDate => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
