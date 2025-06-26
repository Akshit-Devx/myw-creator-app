import Config from 'react-native-config';

// const awsmobile = {
//   aws_project_region: Config.AWS_PROJECT_REGION,
//   aws_appsync_graphqlEndpoint: Config.AWS_APPSYNC_GRAPHQL_ENDPOINT,
//   aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
//   aws_appsync_apiKey: Config.AWS_APPSYNC_API_KEY,
//   aws_cognito_identity_pool_id: Config.AWS_COGNITO_IDENTITY_POOL_ID,
//   aws_cognito_region: Config.AWS_COGNITO_REGION,
//   aws_user_pools_id: Config.AWS_USER_POOLS_ID,
//   aws_user_pools_web_client_id: Config.AWS_USER_POOLS_WEB_CLIENT_ID,
//   aws_user_files_s3_bucket: Config.AWS_USER_FILES_S3_BUCKET,
//   aws_user_files_s3_bucket_region: Config.AWS_USER_FILES_S3_BUCKET_REGION,
// };

const awsmobile = {
  aws_project_region: 'ap-south-1',
  aws_appsync_graphqlEndpoint:
    'https://pe7umbgipzfjvfrgegegzkdoam.appsync-api.ap-south-1.amazonaws.com/graphql',
  aws_appsync_region: 'ap-south-1',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: 'da2-ue7svsjjjja2xiwdfdw5meczji',
  aws_cognito_identity_pool_id:
    'ap-south-1:5ef9d27e-22a5-4704-bade-d1f3a7a59f2d',
  aws_cognito_region: 'ap-south-1',
  aws_user_pools_id: 'ap-south-1_84AaE1exa',
  aws_user_pools_web_client_id: '32gi8acrn8uuo8728mbfmtmead',
  oauth: {},
  aws_cognito_username_attributes: ['PHONE_NUMBER'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['PHONE_NUMBER'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['PHONE_NUMBER'],
  aws_user_files_s3_bucket: 'mywbrands-stage-bucket',
  aws_user_files_s3_bucket_region: 'ap-south-1',
  aws_cognito_auth_flow_type: 'CUSTOM_AUTH',
};

export default awsmobile;
