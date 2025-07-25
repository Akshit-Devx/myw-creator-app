import axios from 'axios';

export const fetchLocationByPincodeAPI = async pincode => {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    const result = data[0];

    if (result.Status === 'Success' && result.PostOffice?.length > 0) {
      const postOffice = result.PostOffice[0];

      const updatedFields = {
        city: postOffice.District,
        state: postOffice.State,
        country: postOffice.Country,
      };

      return updatedFields;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch location', error);
    return null;
  }
};

export const getInstagramMedia = async accessToken => {
  try {
    const response = await axios.get('https://graph.instagram.com/me/media', {
      params: {
        fields:
          'id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,comments_count,like_count,shortcode',

        access_token: accessToken,
      },
    });
    console.log('response', response);

    const reels = response.data.data.filter(
      item =>
        item.media_type === 'VIDEO' && item.media_product_type === 'REELS',
    );

    return reels;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};
