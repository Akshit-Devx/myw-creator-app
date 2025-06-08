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

export const getCampaignInvitationsByInfluencerId = /* GraphQL */ `
  query GetCampaignInvitationsByInfluencerId(
    $influencerId: ID!
    $isInviteNotified: Boolean
  ) {
    getCampaignInvitationsByInfluencerId(
      influencerId: $influencerId
      isInviteNotified: $isInviteNotified
    ) {
      brandId
      campaignId
      collaborationId
      influencerId
      status
      isInviteNotified
      banner
      campaignName
      campaignType
      campaignCategory
      brandRating
    }
  }
`;

export const filterCampaign = /* GraphQL */ `
  query FilterCampaign($input: SyncFilterCampaignInput) {
    filterCampaign(input: $input) {
      items {
        id
        brandId
        brandName
        brandLogo
        type
        isFeatured
        hasFastApproval
        featuredBanner
        banner
        featuredBanner
        type
        stores
        storesData {
          id
          storeType
          name
          address
          locality
          city
          state
          country
          pincode
          logo
          avgPrice
          storeType
          categories
          services
          establishmentType
          availability {
            day
            openTime
            closeTime
          }
          storeMedia {
            name
            media
          }
        }
        name
        category
        description
        maxInfluencersPerDay
        status
        isAgreementAccepted
        verificationStatus
        verifiedAt
        isArchived
        isFeatured
        suggestionListId
        createdAt
        updatedAt
        requirements {
          platform
          creatorType {
            minFollowers
            maxFollowers
            allowedGuests
            autoRequestApproval
            autoDeliverablesApproval
            offerPercentage
            isAmtLimit
            uptoAmount
            offerings {
              name
              description
            }
            stayDuration {
              days
              nights
            }
            deliverables {
              reels
              posts
              stories
              shorts
            }
          }
          references {
            name
            description
            links
          }
          isNegotiable
        }
      }
      pagination {
        total
        page
        size
        totalPages
        nextToken
      }
    }
  }
`;

export const getCampaign = /* GraphQL */ `
  query GetCampaign($id: ID!) {
    getCampaign(id: $id) {
      id
      brandId
      brandName
      brandLogo
      banner
      featuredBanner
      hasFastApproval
      type
      stores
      storesData {
        id
        name
        address
        locality
        city
        state
        country
        pincode
        logo
        avgPrice
        storeType
        categories
        services
        establishmentType
      }
      name
      category
      description
      maxInfluencersPerDay
      requirements {
        platform
        isNegotiable
        creatorType {
          minFollowers
          maxFollowers
          allowedGuests
          autoRequestApproval
          autoDeliverablesApproval
          offerPercentage
          isAmtLimit
          uptoAmount
          offerings {
            name
            description
          }
          stayDuration {
            days
            nights
          }
          deliverables {
            reels
            posts
            stories
            shorts
          }
        }
        references {
          name
          description
          links
        }
      }
      availability {
        day
        openTime
        closeTime
      }
      status
      isAgreementAccepted
      verificationStatus
      verifiedAt
      isArchived
      isFeatured
      createdAt
      updatedAt
    }
  }
`;
