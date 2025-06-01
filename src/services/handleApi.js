import {generateClient} from 'aws-amplify/api';
import {getIgData, getInfluencer} from './api';

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
    console.log('input', input);
    const response = await client.graphql({
      query: getIgData,
      variables: {
        input,
      },
      authMode: 'userPool',
    });
    console.log('response', response);
    return response?.data?.getIgData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
