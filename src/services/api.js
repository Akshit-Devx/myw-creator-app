export const getInfluencer = /* GraphQL */ `
  query GetInfluencer($id: ID!) {
    getInfluencer(id: $id) {
      id
      name
      slug
      bio
      email
      phone
      isActive
      tags
      themeColor
      ctaButton {
        id
        text
        link
        isActive
        type
      }
      profilePictureWithBg
      profilePictureWithoutBg
      referralCode
      isReferralCTA
      socialLinks {
        instagram
        youtube
        twitter
        tiktok
        snapchat
        vimeo
        linkedIn
        facebook
        pinterest
        telegram
        other
      }
      createdAt
      updatedAt
      isAnalyticsEnabled
      isDarkThemeEnabled
      instagramDetails {
        followersCount
        followsCount
        mediaCount
        username
      }
      instagramToken {
        accessToken
        refreshToken
        fbUserId
        igUserId
        expiresAt
        createdAt
        updatedAt
      }
      profileStatusCode
      isWallLive
      isSubscriptionActive
    }
  }
`;

export const getIgData = /* GraphQL */ `
  mutation GetIgData($input: SyncGetIgDataInput) {
    getIgData(input: $input) {
      code
      message
    }
  }
`;
