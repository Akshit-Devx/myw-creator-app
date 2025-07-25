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
        storeMedia {
          name
          media
        }
        availability {
          day
          openTime
          closeTime
        }
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

export const getSubscriptionPurchasedByInfluencerId = /* GraphQL */ `
  query GetSubscriptionPurchasedByInfluencerId(
    $influencerId: String!
    $limit: Int
    $nextToken: String
  ) {
    getSubscriptionPurchasedByInfluencerId(
      influencerId: $influencerId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        phone
        planId
        planName
        planPricing
        planInterval
        planDescription
        startDate
        endDate
        razorpayCustomerId
        razorpaySubscriptionId
        paymentStatus
        totalAmt
        isActive
        status
        haltedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const updateInfluencer = /* GraphQL */ `
  mutation UpdateInfluencer($input: UpdateInfluencerInput!) {
    updateInfluencer(input: $input) {
      id
    }
  }
`;

export const getInfluencerBySlug = /* GraphQL */ `
  query GetInfluencerBySlug($slug: String!, $limit: Int, $nextToken: String) {
    getInfluencerBySlug(slug: $slug, limit: $limit, nextToken: $nextToken) {
      id
      name
      slug
    }
  }
`;

export const getInfluencerAddressByInfluencerId = /* GraphQL */ `
  query GetInfluencerAddressByInfluencerId(
    $influencerId: String!
    $limit: Int
    $nextToken: String
  ) {
    getInfluencerAddressByInfluencerId(
      influencerId: $influencerId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        addressLine1
        addressLine2
        city
        state
        country
        pincode
        isArchived
        createdAt
        updatedAt
      }
    }
  }
`;

export const updateInfluencerAddress = /* GraphQL */ `
  mutation UpdateInfluencerAddress($input: UpdateInfluencerAddressInput) {
    updateInfluencerAddress(input: $input) {
      id
      influencerId
      addressLine1
      addressLine2
      city
      state
      country
      pincode
      isArchived
      createdAt
      updatedAt
    }
  }
`;

export const createInfluencerAddress = /* GraphQL */ `
  mutation CreateInfluencerAddress($input: CreateInfluencerAddressInput) {
    createInfluencerAddress(input: $input) {
      id
      influencerId
      addressLine1
      addressLine2
      city
      state
      country
      pincode
      isArchived
      createdAt
      updatedAt
    }
  }
`;

export const getReferralTrackingByInfluencerId = /* GraphQL */ `
  query GetReferralTrackingByInfluencerId(
    $influencerId: String!
    $limit: Int
    $nextToken: String
  ) {
    getReferralTrackingByInfluencerId(
      influencerId: $influencerId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        referralCode
        referralsFromCta
        currentWalletBalance
        totalEarnings
        listOfReferrals {
          influencerId
          referredDate
          bonus
          bonusDate
        }
        withdrawalHistroy {
          amount
          createdAt
          updatedAt
          payoutMethodId
          status
        }
        payoutMethods {
          id
          methodName
          upiId
          bankAccountNumber
          bankIfscCode
          beneficiaryName
          isArchived
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const updateReferralTracking = /* GraphQL */ `
  mutation UpdateReferralTracking($input: UpdateReferralTrackingInput!) {
    updateReferralTracking(input: $input) {
      id
      influencerId
      referralCode
      listOfReferrals {
        influencerId
        referredDate
        bonus
        bonusDate
        planName
      }
      currentWalletBalance
      totalEarnings
      withdrawalHistroy {
        amount
        createdAt
        updatedAt
        payoutMethodId
        status
      }
      payoutMethods {
        id
        methodName
        upiId
        bankAccountNumber
        bankIfscCode
        beneficiaryName
        isArchived
      }
      createdAt
      updatedAt
    }
  }
`;

export const createWithdrawRequest = /* GraphQL */ `
  mutation CreateWithdrawRequest($input: WithdrawInput!) {
    createWithdrawRequest(input: $input) {
      code
      message
    }
  }
`;

export const getInstagramDMByInfluencerId = /* GraphQL */ `
  query GetInstagramDMByInfluencerId(
    $influencerId: String!
    $limit: Int
    $nextToken: String
  ) {
    getInstagramDMByInfluencerId(
      influencerId: $influencerId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        reelId
        userId
        igAccountId
        thumbnailUrl
        isActive
        permalink
        isKeywordFilteredDM
        isCommentReply
        commentReplyText
        commentsList {
          id
          text
          timestamp
        }
        keywords
        cardType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const updateInstagramDM = /* GraphQL */ `
  mutation UpdateInstagramDM($input: UpdateInstagramDMInput!) {
    updateInstagramDM(input: $input) {
      id
      influencerId
      reelId
      userId
      igAccountId
      thumbnailUrl
      isActive
      isCommentReply
      isKeywordFilteredDM
      commentReplyText
      keywords
      permalink
      commentsList {
        id
        text
        timestamp
      }
      cardType
      cardData {
        image
        title
        subtitle
        button {
          title
          link
          shortCode
        }
      }
    }
  }
`;
