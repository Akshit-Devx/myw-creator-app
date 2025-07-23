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
