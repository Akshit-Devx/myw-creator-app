import {BRANDS_MEDIA_URL, MEDIA_URL} from '../config/envConfig';

export const getMediaURL = key => {
  return `${MEDIA_URL}/${key}`;
};

export const getBrandMediaUrl = key => {
  return `https://${BRANDS_MEDIA_URL}/${key}?optimizer=image`;
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

export const checkSubscriptionStatus = subscription => {
  return Boolean(subscription?.id && subscription?.isActive);
};

export const getVisitMonth = (availability, type) => {
  // Get current year
  const currentYear = new Date().getFullYear();

  // Get current month (0-11)
  const currentMonth = new Date().getMonth();

  // Get current day of month (1-31)
  const currentDay = new Date().getDate();

  // Month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Function to get number of days in a month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Map day names to match availability format
  const dayNameToAvailabilityFormat = dayName => {
    const map = {
      Mon: 'MONDAY',
      Tue: 'TUESDAY',
      Wed: 'WEDNESDAY',
      Thu: 'THURSDAY',
      Fri: 'FRIDAY',
      Sat: 'SATURDAY',
      Sun: 'SUNDAY',
    };
    return map[dayName];
  };

  // Check if a day is available based on the availability array
  const isDayAvailable = dayName => {
    const formattedDay = dayNameToAvailabilityFormat(dayName);

    // Check if availability has "ALL" days
    const hasAllDays = availability?.some(slot => slot?.day === 'ALL');

    // If "ALL" is present and type is RESORTS, disable Friday, Saturday, and Sunday
    if (hasAllDays && type === 'RESORTS') {
      const disabledDays = ['FRIDAY', 'SATURDAY', 'SUNDAY'];
      if (disabledDays.includes(formattedDay)) {
        return false;
      }
    }

    return availability?.some(
      slot => slot?.day === 'ALL' || slot?.day === formattedDay,
    );
  };
  // Function to generate dates for a specific month
  const getDatesForMonth = (month, year) => {
    const daysCount = getDaysInMonth(month, year);
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to compare dates properly

    for (let day = 1; day <= daysCount; day++) {
      // Create date object for this specific day
      const date = new Date(year, month, day);
      const dayOfWeek = date.toLocaleDateString('en-US', {weekday: 'short'});

      // Check if this day is available based on the availability array
      const isAvailable = isDayAvailable(dayOfWeek);

      // Check if this date is in the past
      const isPastDate = date < today;

      // Format options
      const dateObj = {
        dateObj: date,
        value: day, // day number (1-31)
        date: new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toISOString()
          .split('T')[0], // YYYY-MM-DD format
        dayOfWeek: dayOfWeek, // Mon, Tue, etc.
        fullDate: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }), // Monday, January 1, 2025
        isAvailable: isAvailable && !isPastDate, // Only available if not in the past
        isPastDate: isPastDate, // Flag to indicate if this date is in the past
      };

      dates.push(dateObj);
    }

    return dates;
  };

  // For non-RESORT campaigns, only show current month
  // For RESORT campaigns, show 3 months from current month
  const monthsToShow = type === 'RESORTS' ? 3 : 1;

  // Generate options array based on campaign type
  const options = months
    .slice(currentMonth, currentMonth + monthsToShow) // Show only specified number of months
    .map((month, index) => {
      // Adjust index to match actual month (current month + index)
      const actualMonthIndex = currentMonth + index;

      const daysInMonth = getDaysInMonth(actualMonthIndex, currentYear);
      const dates = getDatesForMonth(actualMonthIndex, currentYear);

      return {
        value: `${month.toLowerCase()}${currentYear}`,
        label: `${month} ${currentYear}`,
        days: daysInMonth,
        dates: dates,
      };
    });

  // Set default value to current month
  const defaultValue = `${months[currentMonth].toLowerCase()}${currentYear}`;

  // Get days in the current month
  const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);

  // Get dates for the current month
  const datesInCurrentMonth = getDatesForMonth(currentMonth, currentYear);

  return {
    defaultValue,
    options,
    daysInCurrentMonth,
    datesInCurrentMonth,
    currentMonth,
    currentYear,
    currentDay,
    months: months.slice(currentMonth, currentMonth + monthsToShow), // Only include specified number of months
  };
};

export const generateTimeSlots = (availability, selectedDate) => {
  if (!availability || !selectedDate) return [];

  // Find the availability for the selected date
  const dateAvailability = availability.find(slot => {
    const dayName = new Date(selectedDate)
      .toLocaleDateString('en-US', {weekday: 'long'})
      .toUpperCase();
    return slot.day === 'ALL' || slot.day === dayName;
  });

  if (!dateAvailability) return [];

  const {openTime, closeTime} = dateAvailability;

  // Convert time strings to minutes for easier calculation
  const convertTimeToMinutes = timeStr => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const openMinutes = convertTimeToMinutes(openTime);
  const closeMinutes = convertTimeToMinutes(closeTime);

  // Generate 3-hour slots
  const slots = [];
  const slotDuration = 3 * 60; // 3 hours in minutes

  for (
    let startMinutes = openMinutes;
    startMinutes + slotDuration <= closeMinutes;
    startMinutes += slotDuration
  ) {
    const endMinutes = startMinutes + slotDuration;

    // Convert back to time format
    const startHours = Math.floor(startMinutes / 60);
    const startMins = startMinutes % 60;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    const startTime = `${startHours.toString().padStart(2, '0')}:${startMins
      .toString()
      .padStart(2, '0')}`;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins
      .toString()
      .padStart(2, '0')}`;

    // Format time to 12-hour format without seconds
    const formatTimeTo12Hour = timeStr => {
      const [hours, minutes] = timeStr.split(':').map(Number);

      if (hours === 0) return `12 AM`;
      if (hours === 12) return `12 PM`;

      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours > 12 ? hours - 12 : hours;

      return `${hours12} ${period}`;
    };

    slots.push({
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      displayTime: `${formatTimeTo12Hour(startTime)} - ${formatTimeTo12Hour(
        endTime,
      )}`,
      startMinutes,
      endMinutes,
    });
  }

  return slots;
};

export const stepsData = data => {
  if (!data || !data?.timeLine) {
    return {data: []};
  }

  const collaborationState = {
    REQUESTED: 'Request Sent',
    REJECTED: 'Request Rejected',
    ACCEPTED: 'Accepted',
    NEGOTIATION: 'Negotiation',
    AGREEMENT_ACCEPTED: 'Agreement Accepted',
    VISITED: 'Visited',
    BILL_PAID: 'Bill Paid',
    DELIVERABLES_SUBMITTED: 'Deliverables Submitted',
    DELIVERABLES_RESUBMITTED: 'Deliverables ReSubmitted',
    DELIVERABLES_REJECTED: 'Deliverables Rejected',
    DELIVERABLES_ACCEPTED: 'Deliverables Accepted',
    DELIVERABLES_REVISION: 'Deliverables Revision',
    LIVE_LINK: 'Submit Live Link',
    COMPLETED: 'Completed',
  };

  const formattedTimeline = data?.timeLine?.map(item => ({
    state: collaborationState[item?.state] || item?.state,
    date: item?.date ? formatDate(item?.date) : undefined,
  }));

  if (
    data.status === 'REQUESTED' ||
    data.status === 'NEGOTIATION' ||
    data.status === 'ACCEPTED'
  ) {
    return {
      data: [...formattedTimeline, {state: 'Completed'}],
    };
  }

  return {
    data: formattedTimeline,
  };
};
