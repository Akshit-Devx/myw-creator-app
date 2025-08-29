import {generateClient} from 'aws-amplify/api';
import {
  checkInfluencerApplyEligibility,
  createInfluencerAddress,
  createPortfolioCategory,
  createPortfolioVideo,
  createRazorpayCheckout,
  createSubscriptionPurchasedItem,
  createWithdrawRequest,
  filterCampaign,
  getCampaign,
  getCampaignDetailsById,
  getCampaignInvitationsByInfluencerId,
  getCollaborationDetailsById,
  getCollabRatingsByGSI,
  getIgData,
  getInfluencer,
  getInfluencerAddressByInfluencerId,
  getInfluencerBySlug,
  getInfluencerPortfolioByInfluencerId,
  getInstagramDMByGSI,
  getInstagramDMByInfluencerId,
  getPortfolioCategoryById,
  getPortfolioVideosByCategoryId,
  getReferralTrackingByInfluencerId,
  getSocialInsightsByInfluencerIdApi,
  getSubscriptionPurchasedByInfluencerId,
  getWhitelistByInfluencerId,
  updateCollaborationByInfluencer,
  updateInfluencer,
  updateInfluencerAddress,
  updateInstagramDM,
  updateInstagramDMItems,
  updatePortfolioCategory,
  updatePortfolioVideo,
  updateReferralTracking,
  updateSocialsToken,
  updateSuggestionListData,
} from './api';
import fetchData from '../utility/fetchData';

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
    const res = await client.graphql({
      query: getSubscriptionPurchasedByInfluencerId,
      variables: {
        influencerId,
      },
      authMode: 'userPool',
    });

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

export const updateReferralTrackingAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateReferralTracking,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    return response?.data?.updateReferralTracking;
  } catch (error) {
    console.error('Error updating referral tracking:', error);
    throw error;
  }
};

export const createWithdrawRequestAPI = async data => {
  try {
    const response = await client.graphql({
      query: createWithdrawRequest,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    return response?.data?.createWithdrawRequest;
  } catch (error) {
    console.error('Error creating withdraw request:', error);
    throw error;
  }
};

export const getInstagramDMByInfluencerIdAPI = async influencerId => {
  try {
    const response = await client.graphql({
      query: getInstagramDMByInfluencerId,
      variables: {
        influencerId,
        limit: 100,
        nextToken: null,
      },
      authMode: 'userPool',
    });
    return response?.data?.getInstagramDMByInfluencerId?.items;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateInstagramDMAPI = async data => {
  try {
    console.log('data', data);
    const response = await client.graphql({
      query: updateInstagramDM,
      variables: {
        input: data,
      },
      authMode: 'userPool',
    });
    return response?.data?.updateInstagramDM;
  } catch (error) {
    console.error('Error updating instagram dm:', error);
    throw error;
  }
};

export const getInstagramDMByGSIAPI = async data => {
  try {
    const response = await client.graphql({
      query: getInstagramDMByGSI,
      variables: {
        reelId: data.reelId || '',
        brandId: data.brandId || '',
        limit: data.limit || 100,
      },
      authMode: 'userPool',
    });
    return response?.data?.getInstagramDMByGSI?.items || [];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateInstagramDMItemsAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateInstagramDMItems,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.updateInstagramDMItems;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateSocialsTokenAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateSocialsToken,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.updateSocialsToken;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const getSocialInsightsByInfluencerId = async data => {
  try {
    const response = await client.graphql({
      query: getSocialInsightsByInfluencerIdApi,
      variables: {influencerId: data},
      authMode: 'userPool',
    });
    return response?.data?.getSocialInsightsByInfluencerId?.items || [];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getCollabRatingsByGSIAPI = async ({influencerId}) => {
  try {
    const response = await client.graphql({
      query: getCollabRatingsByGSI,
      variables: {influencerId},
      authMode: 'userPool',
    });

    return response?.data?.getCollabRatingsByGSI;
  } catch (error) {
    console.error('Error fetching collaboration ratings:', error);
    throw error;
  }
};

export const createInfluencerPortfolioCategoryAPI = async input => {
  try {
    const response = await client.graphql({
      query: createPortfolioCategory,
      variables: {input},
      authMode: 'userPool',
    });
    return response?.data?.createPortfolioCategory;
  } catch (error) {
    console.log('Error creating influencer portfolio category:', error);
    throw error;
  }
};

export const getInfluencerPortfolioByInfluencerIdAPI = async influencerId => {
  try {
    const response = await client.graphql({
      query: getInfluencerPortfolioByInfluencerId,
      variables: {influencerId},
      authMode: 'userPool',
    });
    return response?.data?.getInfluencerPortfolioByInfluencerId;
  } catch (error) {
    console.log('Error getting influencer portfolio by influencer id:', error);
    throw error;
  }
};

export const getInfluencerPortfolioCategoryByIdAPI = async id => {
  try {
    const response = await client.graphql({
      query: getPortfolioCategoryById,
      variables: {id},
      authMode: 'userPool',
    });
    return response?.data?.getPortfolioCategoryById;
  } catch (error) {
    console.log('Error getting influencer portfolio category by id:', error);
    throw error;
  }
};

export const getInfluencerPortfolioVideosByCategoryIdAPI = async categoryId => {
  try {
    const response = await client.graphql({
      query: getPortfolioVideosByCategoryId,
      variables: {categoryId},
      authMode: 'userPool',
    });
    return response?.data?.getPortfolioVideosByCategoryId?.items;
  } catch (error) {
    console.log(
      'Error getting influencer portfolio videos by category id:',
      error,
    );
    throw error;
  }
};

export const updateInfluencerPortfolioVideoAPI = async input => {
  try {
    const response = await client.graphql({
      query: updatePortfolioVideo,
      variables: {input},
      authMode: 'userPool',
    });
    return response?.data?.updatePortfolioVideo;
  } catch (error) {
    console.log('Error updating influencer portfolio video:', error);
    throw error;
  }
};

export const updateInfluencerPortfolioCategoryAPI = async input => {
  try {
    const response = await client.graphql({
      query: updatePortfolioCategory,
      variables: {input},
      authMode: 'userPool',
    });
    return response?.data?.updatePortfolioCategory;
  } catch (error) {
    console.log('Error updating influencer portfolio category:', error);
    throw error;
  }
};

export const createInfluencerPortfolioVideoAPI = async input => {
  try {
    const response = await client.graphql({
      query: createPortfolioVideo,
      variables: {input},
      authMode: 'userPool',
    });
    return response?.data?.createPortfolioVideo;
  } catch (error) {
    console.log('Error creating influencer portfolio video:', error);
    throw error;
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
    return response?.data?.createSubscriptionPurchasedItem;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const checkInfluencerApplyEligibilityAPI = async data => {
  try {
    const response = await client.graphql({
      query: checkInfluencerApplyEligibility,
      variables: data,
      authMode: 'userPool',
    });
    return response?.data?.checkInfluencerApplyEligibility;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const getWhitelistByInfluencerIdAPI = async influencerId => {
  try {
    const response = await client.graphql({
      query: getWhitelistByInfluencerId,
      variables: {influencerId},
      authMode: 'userPool',
    });
    return response?.data?.getWhitelistByInfluencerId?.items;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

export const updateCollaborationAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateCollaborationByInfluencer,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.updateCollaborationByInfluencer;
  } catch (error) {
    console.log('Error:', error);
    return error?.errors[0];
  }
};

export const getCollaborationByIdAPI = async id => {
  try {
    const response = await client.graphql({
      query: getCollaborationDetailsById,
      variables: {id},
      authMode: 'userPool',
    });
    return response?.data?.getCollaborationDetailsById;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const updateSuggestionListDataAPI = async data => {
  try {
    const response = await client.graphql({
      query: updateSuggestionListData,
      variables: {input: data},
      authMode: 'userPool',
    });
    return response?.data?.updateSuggestionListData;
  } catch (error) {
    console.log('Error:', error);
  }
};

export const getPublishedCampaign = async ({
  id,
  revalidate = 0,
  tags = ['campaign-data', `campaign-${id}`],
}) => {
  try {
    const data = await fetchData(
      getCampaignDetailsById,
      {id},
      {
        next: {revalidate, tags},
      },
    );

    return data?.getCampaignDetailsById;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    return null;
  }
};
