import {generateClient} from 'aws-amplify/api';
import {
  createInfluencerAddress,
  filterCampaign,
  getCampaign,
  getCampaignInvitationsByInfluencerId,
  getIgData,
  getInfluencer,
  getInfluencerAddressByInfluencerId,
  getInfluencerBySlug,
  getReferralTrackingByInfluencerId,
  getSubscriptionPurchasedByInfluencerId,
  updateInfluencer,
  updateInfluencerAddress,
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

export const updateInfluencerAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateInfluencer,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    return response?.data?.updateInfluencer;
  } catch (error) {
    console.error('Error updating influencer:', error);
    throw error;
  }
};

export const getUserBySlugAPI = async slug => {
  try {
    const response = await client.graphql({
      query: getInfluencerBySlug,
      variables: {
        slug,
      },
      authMode: 'userPool',
    });
    return response?.data?.getInfluencerBySlug;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getInfluencerAddressByInfluencerIdAPI = async influencerId => {
  try {
    const response = await client.graphql({
      query: getInfluencerAddressByInfluencerId,
      variables: {
        influencerId,
        limit: 100,
        nextToken: null,
      },
      authMode: 'userPool',
    });

    const items =
      response?.data?.getInfluencerAddressByInfluencerId?.items || [];

    const activeItems = items.filter(item => !item.isArchived);

    return activeItems;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateInfluencerAddressAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateInfluencerAddress,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    console.log('response updateInfluencerAddressAPI', response);
    return response?.data?.updateInfluencerAddress;
  } catch (error) {
    console.error('Error updating influencer address:', error);
    throw error;
  }
};

export const createInfluencerAddressAPI = async data => {
  try {
    const response = await client.graphql({
      query: createInfluencerAddress,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    console.log('response createInfluencerAddressAPI', response);
    return response?.data?.createInfluencerAddress;
  } catch (error) {
    console.error('Error creating influencer address:', error);
    throw error;
  }
};

export const getReferralTrackingByInfluencerIdAPI = async influencerId => {
  try {
    const response = await client.graphql({
      query: getReferralTrackingByInfluencerId,
      variables: {
        influencerId,
        limit: 100,
        nextToken: null,
      },
      authMode: 'userPool',
    });
    return response?.data?.getReferralTrackingByInfluencerId?.items?.[0];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
