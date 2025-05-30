import {generateClient} from 'aws-amplify/api';

const client = generateClient();

// export const getUserByIdAPI = async id => {
//   try {
//     const response = await client.graphql({
//       query: getUser,
//       variables: {
//         id,
//       },
//       authMode: 'userPool',
//     });
//     return response?.data?.getUser;
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };
