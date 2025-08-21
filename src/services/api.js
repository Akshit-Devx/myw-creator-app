export const getInfluencer = /* GraphQL */ `
  query GetInfluencer($id: ID!) {
    getInfluencer(id: $id) {
      id
      name
      slug
      location
      username
      bio
      email
      phone
      gender
      dob
      city
      isActive
      address {
        street
        city
        state
        country
        postalCode
      }
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
      allowInstagramSkip
      instagramDetails {
        followersCount
        followsCount
        mediaCount
        username
      }
      instagramInsights {
        engagementRate
        avgViews
        avgLikes
        avgComments
      }
      youtubeDetails {
        title
        description
        subscriberCount
        videoCount
        viewCount
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
      youtubeToken {
        accessToken
        refreshToken
        createdAt
        updatedAt
      }
      profileStatusCode
      isWallLive
      isSubscriptionActive
      freeTrialExpiresAt
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
      name
      slug
      username
      bio
      location
      email
      phone
      gender
      dob
      city
      label
      isActive
      address {
        street
        city
        state
        country
        postalCode
        __typename
      }
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
        __typename
      }
      createdAt
      updatedAt
      isAnalyticsEnabled
      isDarkThemeEnabled
      isWallLive
      isSubscriptionActive
      allowInstagramSkip
      instagramDetails {
        followersCount
        followsCount
        mediaCount
        username
      }
      instagramInsights {
        engagementRate
        avgViews
        avgLikes
        avgComments
      }
      youtubeDetails {
        title
        description
        subscriberCount
        videoCount
        viewCount
      }
      instagramToken {
        accessToken
        refreshToken
        fbUserId
        igUserId
        pageAccessToken
        expiresAt
        createdAt
        updatedAt
      }
      youtubeToken {
        accessToken
        refreshToken
        createdAt
        updatedAt
      }
      referralCode
      referrerCodeSrc
      isReferralCTA
      profileStatusCode
      freeTrialExpiresAt
      rating
      ratingCount
      __typename
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

export const getInstagramDMByGSI = /* GraphQL */ `
  query GetInstagramDMByGSI(
    $reelId: String
    $influencerId: String
    $brandId: String
    $limit: Int
    $nextToken: String
  ) {
    getInstagramDMByGSI(
      reelId: $reelId
      influencerId: $influencerId
      brandId: $brandId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        brandId
        reelId
        userId
        igAccountId
        thumbnailUrl
        isActive
        permalink
        isKeywordFilteredDM
        isCommentReply
        commentReplyText
        keywords
        commentsList {
          id
          username
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const updateInstagramDMItems = /* GraphQL */ `
  mutation UpdateInstagramDMItems($input: SyncUpdateInstaDM) {
    updateInstagramDMItems(input: $input) {
      code
      message
    }
  }
`;

export const updateSocialsToken = /* GraphQL */ `
  mutation UpdateSocialsToken($input: SyncUpdateSocialsToken!) {
    updateSocialsToken(input: $input) {
      code
      message
    }
  }
`;

export const getSocialInsightsByInfluencerIdApi = /* GraphQL */ `
  query GetSocialInsightsByInfluencerId(
    $influencerId: String!
    $limit: Int
    $nextToken: String
  ) {
    getSocialInsightsByInfluencerId(
      influencerId: $influencerId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        userId
        campaignMetrics {
          last30Days {
            totalDiscount
            totalCompletedCollabs
            discountDiff
            discountGrowth
            totalCollabs
            totalOngoingCollabs
            collabCategory {
              category
              count
            }
          }
          last60Days {
            totalDiscount
            totalCompletedCollabs
            discountDiff
            discountGrowth
            totalCollabs
            totalOngoingCollabs
            collabCategory {
              category
              count
            }
          }
          last90Days {
            totalDiscount
            totalCompletedCollabs
            discountDiff
            discountGrowth
            totalCollabs
            totalOngoingCollabs
            collabCategory {
              category
              count
            }
          }
          updatedAt
        }
        igMetrics {
          last30Days {
            impressions
            likes
            comments
            reach
            saves
            shares
            profileViews
          }
          last60Days {
            impressions
            likes
            comments
            reach
            saves
            shares
            profileViews
          }
          last90Days {
            impressions
            likes
            comments
            reach
            saves
            shares
            profileViews
          }
          ageRatio {
            ageGroup
            percentage
          }
          sexRatio {
            male
            female
            unknown
          }
          cityMetrics {
            cityName
            totalUsers
          }
          countryMetrics {
            countryName
            totalUsers
          }
          updatedAt
        }
        ytMetrics {
          last30Days {
            views
            likes
            comments
            shares
            estMinutesWatched
            avgViewDuration
            subscribersGained
            subscribersLost
          }
          last60Days {
            views
            likes
            comments
            shares
            estMinutesWatched
            avgViewDuration
            subscribersGained
            subscribersLost
          }
          last90Days {
            views
            likes
            comments
            shares
            estMinutesWatched
            avgViewDuration
            subscribersGained
            subscribersLost
          }
          ageRatio {
            ageGroup
            percentage
          }
          sexRatio {
            male
            female
          }
          countryMetrics {
            countryName
            totalUsers
          }
          updatedAt
        }
        gaMetrics {
          last30Days {
            users
            sessions
            events
            views
            deviceCategory {
              desktop
              mobile
              tablet
              others
            }
          }
          last60Days {
            users
            sessions
            events
            views
            deviceCategory {
              desktop
              mobile
              tablet
              others
            }
          }
          last90Days {
            users
            sessions
            events
            views
            deviceCategory {
              desktop
              mobile
              tablet
              others
            }
          }
          cityMetrics {
            cityName
            totalUsers
          }
          countryMetrics {
            countryName
            totalUsers
          }
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const getCollabRatingsByGSI = /* GraphQL */ `
  query GetCollabRatingsByGSI($influencerId: String, $brandId: String) {
    getCollabRatingsByGSI(influencerId: $influencerId, brandId: $brandId) {
      id
      collaborationId
      campaignId
      brandId
      influencerId
      ratingToBrand
      reviewToBrand
      brandRatedAt
      ratingToInfluencer
      reviewToInfluencer
      influencerRatedAt
      createdAt
      updatedAt
      campaignDetails {
        brandName
        brandLogo
        name
      }
      deliverables {
        uploadedLiveLinks {
          type
          link
          igMediaId
          permaLink
          mediaType
        }
      }
      influencerDetails {
        id
        name
      }
    }
  }
`;

export const createPortfolioCategory = /* GraphQL */ `
  mutation CreatePortfolioCategory($input: CreatePortfolioCategoryInput!) {
    createPortfolioCategory(input: $input) {
      id
      influencerId
      title
      tags
      customLinks
      isArchived
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const getInfluencerPortfolioByInfluencerId = /* GraphQL */ `
  query GetInfluencerPortfolioByInfluencerId($influencerId: ID!) {
    getInfluencerPortfolioByInfluencerId(influencerId: $influencerId) {
      id
      influencerId
      title
      tags
      customLinks
      isArchived
      createdAt
      updatedAt
      videos {
        id
        influencerId
        categoryId
        videoUrl
        thumbnailUrl
        caption
        permalink
        insights {
          likes
          comments
          views
          __typename
        }
        brandLogo
        position
        isArchived
        createdAt
        updatedAt
        __typename
      }
      __typename
    }
  }
`;

export const getPortfolioCategoryById = /* GraphQL */ `
  query GetPortfolioCategoryById($id: ID!) {
    getPortfolioCategoryById(id: $id) {
      id
      influencerId
      title
      tags
      customLinks
      isArchived
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const getPortfolioVideosByCategoryId = /* GraphQL */ `
  query GetPortfolioVideosByCategoryId(
    $categoryId: ID!
    $limit: Int
    $nextToken: String
  ) {
    getPortfolioVideosByCategoryId(
      categoryId: $categoryId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        influencerId
        categoryId
        videoUrl
        thumbnailUrl
        caption
        permalink
        insights {
          likes
          comments
          views
          __typename
        }
        brandLogo
        position
        isArchived
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const updatePortfolioVideo = /* GraphQL */ `
  mutation UpdatePortfolioVideo($input: UpdatePortfolioVideoInput!) {
    updatePortfolioVideo(input: $input) {
      id
      influencerId
      categoryId
      videoUrl
      thumbnailUrl
      caption
      permalink
      insights {
        likes
        comments
        views
        __typename
      }
      brandLogo
      position
      isArchived
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updatePortfolioCategory = /* GraphQL */ `
  mutation UpdatePortfolioCategory($input: UpdatePortfolioCategoryInput!) {
    updatePortfolioCategory(input: $input) {
      id
      influencerId
      title
      tags
      customLinks
      isArchived
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createPortfolioVideo = /* GraphQL */ `
  mutation CreatePortfolioVideo($input: CreatePortfolioVideoInput!) {
    createPortfolioVideo(input: $input) {
      id
      influencerId
      categoryId
      videoUrl
      thumbnailUrl
      caption
      permalink
      insights {
        likes
        comments
        views
        __typename
      }
      brandLogo
      position
      isArchived
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createRazorpayCheckout = /* GraphQL */ `
  mutation CreateRazorpayCheckout($input: SyncRazorpayCheckout!) {
    createRazorpayCheckout(input: $input) {
      code
      message
      session
      customerId
    }
  }
`;

export const createSubscriptionPurchasedItem = /* GraphQL */ `
  mutation CreateSubscriptionPurchasedItem(
    $input: SyncCreateSubscriptionPurchasedItem!
  ) {
    createSubscriptionPurchasedItem(input: $input) {
      code
      message
    }
  }
`;