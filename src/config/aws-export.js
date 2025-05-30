import Config from 'react-native-config';

const awsmobile = {
  aws_project_region: Config.AWS_PROJECT_REGION,
  aws_appsync_graphqlEndpoint: Config.AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: Config.AWS_APPSYNC_API_KEY,
  aws_cognito_identity_pool_id: Config.AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: Config.AWS_COGNITO_REGION,
  aws_user_pools_id: Config.AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: Config.AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_user_files_s3_bucket: Config.AWS_USER_FILES_S3_BUCKET,
  aws_user_files_s3_bucket_region: Config.AWS_USER_FILES_S3_BUCKET_REGION,
};

export default awsmobile;
