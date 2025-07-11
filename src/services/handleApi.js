import {generateClient} from 'aws-amplify/api';
import {
  byInfluencerIdReferralTracking,
  createInfluencerAddress,
  createRazorpayCheckout,
  createSubscriptionPurchasedItem,
  createWithdrawRequest,
  filterCampaign,
  getCampaign,
  getCampaignInvitationsByInfluencerId,
  getIgData,
  getInfluencer,
  getInfluencerAddressByInfluencerId,
  getInfluencerData,
  getInstagramDMByInfluencerId,
  getSubscriptionPurchasedByInfluencerId,
  updateInfluencer,
  updateInfluencerAddress,
  updateReferralTracking,
} from './api';

const client = generateClient();

export const getInfluencerByIdAPI = async id => {
  try {
    const response = await client.graphql({
      query: getInfluencer,
      variables: {
        id,
      },
      authMode: 'userPool',
    });
    return response?.data?.getInfluencer;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getIgDataAPI = async input => {
  try {
    const response = await client.graphql({
      query: getIgData,
      variables: {
        input,
      },
      authMode: 'userPool',
    });
    return response?.data?.getIgData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getCampaignInvitationsByInfluencerIdAPI = async input => {
  try {
    const response = await client.graphql({
      query: getCampaignInvitationsByInfluencerId,
      variables: {
        input,
      },
      authMode: 'userPool',
    });
    return response?.data?.getIgData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const filterCampaignAPI = async input => {
  try {
    const response = await client.graphql({
      query: filterCampaign,
      variables: {
        input,
      },
      authMode: 'userPool',
    });
    return response?.data?.filterCampaign;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getCampaignByIdAPI = async id => {
  try {
    const response = await client.graphql({
      query: getCampaign,
      variables: {
        id,
      },
      authMode: 'userPool',
    });
    return response?.data?.getCampaign;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getSubscriptionPurchasedByInfluencerIdAPI = async influencerId => {
  try {
    console.log('influencerId', influencerId);
    const res = await client.graphql({
      query: getSubscriptionPurchasedByInfluencerId,
      variables: {
        influencerId,
      },
      authMode: 'userPool',
    });
    console.log('res', res);

    const subscriptions =
      res?.data?.getSubscriptionPurchasedByInfluencerId?.items;

    if (!subscriptions || subscriptions.length === 0) {
      return null;
    }
    const latestSubscription = subscriptions?.sort(
      (a, b) =>
        new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
    )[0];

    return latestSubscription;
  } catch (error) {
    console.error('Error updating influencer:', error);
    throw error;
  }
};

export const updateinfluencer = async data => {
  try {
    const res = await client.graphql({
      query: updateInfluencer,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });

    return res;
  } catch (error) {
    console.error('Error updating influencer:', error);
    throw error;
  }
};

export const getReferralByInfluencerId = async data => {
  try {
    return await client.graphql({
      query: byInfluencerIdReferralTracking,
      variables: {influencerId: data},
      authMode: 'userPool',
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createWithdrawalRequest = async data => {
  try {
    return await client.graphql({
      query: createWithdrawRequest,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getUserBySlug = async slug => {
  try {
    const influencerResponse = await client.graphql({
      query: getInfluencerData,
      variables: {slug},
      authMode: 'userPool',
    });

    const influencer = influencerResponse.data.getInfluencerBySlug;
    return influencer;
  } catch {
    return {id: '', name: '', bio: ''};
  }
};

export const createRazorpayCheckoutAPI = async data => {
  try {
    const response = await client.graphql({
      query: createRazorpayCheckout,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.createRazorpayCheckout;
  } catch (error) {
    console.log('Error', error);
  }
};

export const createSubscriptionPurchasedAPI = async data => {
  try {
    const response = await client.graphql({
      query: createSubscriptionPurchasedItem,
      variables: {input: data},
      authMode: 'userPool',
    });
    console.log(
      'response?.data?.createSubscriptionPurchasedItem : ',
      response?.data?.createSubscriptionPurchasedItem,
    );

    return response?.data?.createSubscriptionPurchasedItem;
  } catch (error) {
    console.log('createSubscriptionPurchasedAPI function error ::: ', error);
  }
};

export const getInstagramDmByInfluencerId = async influencerId => {
  try {
    const resposne = await client.graphql({
      query: getInstagramDMByInfluencerId,
      variables: {
        influencerId,
      },
      authMode: 'userPool',
    });

    return resposne?.data?.getInstagramDMByInfluencerId?.items || [];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getInfluencerAddressByInfluencerIdAPI = async (
  influencerId,
  limit,
  nextToken,
) => {
  try {
    const response = await client.graphql({
      query: getInfluencerAddressByInfluencerId,
      variables: {influencerId, limit, nextToken},
      authMode: 'userPool',
    });
    return response?.data?.getInfluencerAddressByInfluencerId?.items;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const updateInfluencerAddressAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateInfluencerAddress,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.updateInfluencerAddress;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const createInfluencerAddressAPI = async data => {
  try {
    const response = await client.graphql({
      query: createInfluencerAddress,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.createInfluencerAddress;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const updateReferralData = async data => {
  try {
    return await client.graphql({
      query: updateReferralTracking,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
