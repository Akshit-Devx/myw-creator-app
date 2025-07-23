import {
  AWS_APPSYNC_API_KEY,
  AWS_APPSYNC_GRAPHQL_ENDPOINT,
  AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_COGNITO_REGION,
  AWS_PROJECT_REGION,
  AWS_USER_FILES_S3_BUCKET,
  AWS_USER_FILES_S3_BUCKET_REGION,
  AWS_USER_POOLS_ID,
  AWS_USER_POOLS_WEB_CLIENT_ID,
} from './envConfig';

const awsmobile = {
  aws_project_region: AWS_PROJECT_REGION,
  aws_appsync_graphqlEndpoint: AWS_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_appsync_apiKey: AWS_APPSYNC_API_KEY,
  aws_cognito_identity_pool_id: AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: AWS_COGNITO_REGION,
  aws_user_pools_id: AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: AWS_USER_POOLS_WEB_CLIENT_ID,
  aws_user_files_s3_bucket: AWS_USER_FILES_S3_BUCKET,
  aws_user_files_s3_bucket_region: AWS_USER_FILES_S3_BUCKET_REGION,
};

export default awsmobile;
