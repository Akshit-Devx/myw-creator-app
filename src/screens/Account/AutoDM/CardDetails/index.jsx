import {useCallback, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, View, ScrollView, Text} from 'react-native';

import {useSelector} from 'react-redux';
import {uploadData} from 'aws-amplify/storage';
import Clipboard from '@react-native-clipboard/clipboard';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';

import PostCard from '../../../../components/PostCard';
import { formatDate } from '../../../../utility/helper';
import Button from '../../../../components/elements/Button';
import InputField from '../../../../components/elements/Input';
import Checkbox from '../../../../components/elements/Checkbox';
import AutoDmModal from '../../../../components/modals/AutoDmModal';
import { updateInstagramDMItemsAPI } from '../../../../services/handleApi';
import ButtonCardTemplate from '../../../../components/cards/ButtonCardTemplate';
import GenericCardTemplate from '../../../../components/cards/GenericCardTemplate';
import MultiSelectDropdown from '../../../../components/elements/MultiSelectDropdown';
import DetailStackHeader from '../../../../components/common/DetailStackHeader';

const options = [
  {
    value: 'Interested',
    label: 'Interested',
  },
  {
    value: 'Link',
    label: 'Link',
  },
  {
    value: 'Info',
    label: 'Info',
  },
  {
    value: 'Price',
    label: 'Price',
  },
  {
    value: 'Discount',
    label: 'Discount',
  },
  {
    value: 'Promo',
    label: 'Promo',
  },
];

const CardDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {onBoarding} = useSelector(state => state.onBoarding);
  const [isDMToAllComment, setIsDMToAllComment] = useState(true);
  const [automaticReply, setAutomaticReply] = useState(true);
  const [reel, setReel] = useState(null);
  const [linkSentToDM, setLinkSentToDM] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisibleAutoDMModal, setIsVisibleAutoDMModal] = useState(false);
  const [errors, setErrors] = useState({
    invalidCardIndices: [],
    invalidLinkIndices: {},
    invalidTitleIndices: {},
    invalidImageIndices: [],
    keywords: '',
    commentReply: '',
  });
  const [carouselCards, setCarouselCards] = useState([
    {
      title: 'Hey @username find links below ⬇️',
      button: [],
      isEditing: false,
      isTitleEditing: false,
      image: '',
    },
  ]);

  const isValidURL = useCallback(url => {
    if (!url || typeof url !== 'string') return false;
    try {
      const parsedURL = new URL(url);

      const isValidProtocol =
        parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:';
      const hasHost = !!parsedURL.host;

      return isValidProtocol && hasHost;
    } catch (_) {
      return false;
    }
  }, []);

  const handlePaste = useCallback(
    async (cardIndex, btnIndex) => {
      try {
        const clipboardContent = await Clipboard.getString();
        handleBtnInputChange(cardIndex, btnIndex, 'link', clipboardContent);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [handleBtnInputChange],
  );

  const handleSave = useCallback(
    index => {
      let hasInvalidLinks = false;
      setCarouselCards(prevCards => {
        const cardToSave = prevCards[index];
        const updatedButtons = cardToSave.button.map((btn, btnIndex) => {
          const title = btn.title.trim();
          const link = btn.link.trim();
          const isValid = isValidURL(link);
          hasInvalidLinks = !isValid;
          if (title && link && isValid) {
            return {...btn, isEdit: false};
          }
          return btn; // Keep invalid buttons for highlighting
        });

        const cleanedCard = {
          ...cardToSave,
          button: updatedButtons,
        };

        const updatedFormData = [...prevCards];
        updatedFormData[index] = {
          ...cleanedCard,
          isEditing: hasInvalidLinks,
          isTitleEditing: false,
        };

        // Validate links and update errors
        const invalidIndices = updatedFormData
          .map((card, index) => (card.button.length === 0 ? index : -1))
          .filter(index => index !== -1);
        const invalidLinkIndices = updatedButtons
          .map((btn, btnIndex) =>
            !btn.link.trim() || !isValidURL(btn.link.trim()) ? btnIndex : -1,
          )
          .filter(idx => idx !== -1);
        const invalidTitleIndices = updatedButtons
          .map((btn, btnIndex) =>
            !btn.title.trim() || btn.title.trim().length > 30 ? btnIndex : -1,
          )
          .filter(idx => idx !== -1);
        setErrors(prev => ({
          ...prev,
          invalidTitleIndices: {
            ...prev.invalidTitleIndices,
            [index]: invalidTitleIndices.length > 0 ? invalidTitleIndices : [],
          },
          invalidLinkIndices: {
            ...prev.invalidLinkIndices,
            [index]: invalidLinkIndices.length > 0 ? invalidLinkIndices : [],
          },
          invalidCardIndices: invalidIndices,
        }));

        return updatedFormData;
      });
    },
    [isValidURL],
  );

  const handleImageUpload = async cardIndex => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const uri = file.uri;
      const fileName = `${new Date().getTime()}-${file.fileName || 'image'}`;
      const mimeType = file.type || 'image/jpeg';

      const response = await fetch(uri);
      const blob = await response.blob();

      const resultUpload = await uploadData({
        key: `instagramDm/card/images/${fileName}-${Date.now()}`,
        data: blob,
        options: {
          contentType: mimeType,
          accessLevel: 'guest',
          onProgress: ({transferredBytes, totalBytes}) => {
            const progress = (transferredBytes / totalBytes) * 100;
          },
        },
      }).result;
      if (resultUpload?.key) {
        setCarouselCards(prevCards => {
          const updatedFormData = [...prevCards];
          updatedFormData[cardIndex] = {
            ...updatedFormData[cardIndex],
            image: 'public/' + resultUpload?.key,
          };
          return updatedFormData;
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddCard = useCallback(() => {
    setCarouselCards(prev => [
      ...prev,
      {
        image: '',
        title: 'Card Title',
        subtitle: 'Powered By Mywall',
        button: [],
        isTitleEditing: false,
        isEditing: false,
      },
    ]);
  }, []);

  const handleBtnInputChange = useCallback(
    (cardIndex, btnIndex, key, value) => {
      if (key === 'title' && value.length > 30) return;

      setCarouselCards(prevCards => {
        const updated = [...prevCards];
        updated[cardIndex].button[btnIndex] = {
          ...updated[cardIndex].button[btnIndex],
          [key]: value,
        };
        return updated;
      });
      // Clear error for the specific button if the title or link is updated
      setErrors(prev => {
        const titleIndices = prev.invalidTitleIndices[cardIndex] || [];
        const linkIndices = prev.invalidLinkIndices[cardIndex] || [];
        const newTitleIndices =
          key === 'title'
            ? titleIndices.filter(idx => idx !== btnIndex)
            : titleIndices;
        const newLinkIndices =
          key === 'link'
            ? linkIndices.filter(idx => idx !== btnIndex)
            : linkIndices;
        return {
          ...prev,
          invalidTitleIndices: {
            ...prev.invalidTitleIndices,
            [cardIndex]: newTitleIndices.length > 0 ? newTitleIndices : [],
          },
          invalidLinkIndices: {
            ...prev.invalidLinkIndices,
            [cardIndex]: newLinkIndices.length > 0 ? newLinkIndices : [],
          },
        };
      });
    },
    [],
  );

  const handleAddButton = useCallback(index => {
    setCarouselCards(prevCards => {
      const updated = [...prevCards];
      const buttons =
        updated[index]?.button?.length > 0
          ? [
              ...updated[index]?.button,
              {
                title: '',
                link: '',
                isEdit: true,
              },
            ]
          : [
              {
                title: '',
                link: '',
                isEdit: true,
              },
            ];
      const card = {
        ...updated[index],
        button: buttons,
        isEditing: true,
      };
      updated[index] = card;
      return updated;
    });
  }, []);

  const toggleEditMode = useCallback((cardIndex, btnIndex) => {
    setCarouselCards(prevCards => {
      const updated = [...prevCards];
      const card = updated[cardIndex];
      card.button[btnIndex] = {
        ...card?.button[btnIndex],
        isEdit: true,
      };
      updated[cardIndex] = {...card, isEditing: true};
      return updated;
    });
  }, []);

  const handleDMToAllCommentChange = useCallback(() => {
    setIsDMToAllComment(prev => !prev);
    setErrors(prev => ({...prev, keywords: ''}));
  }, []);

  const handleSpecifyKeywordsChange = useCallback(() => {
    setIsDMToAllComment(prev => !prev);
    setErrors(prev => ({...prev, keywords: ''}));
  }, []);

  const handleAutomaticReply = useCallback(() => {
    setAutomaticReply(prev => {
      if (!prev) {
        setLinkSentToDM('');
      }
      setErrors(prev => ({...prev, commentReply: ''}));
      return !prev;
    });
  }, []);

  const handleLinkSentToDMChange = useCallback(text => {
    setLinkSentToDM(text);
    setErrors(prev => ({...prev, commentReply: ''}));
  }, []);

  const handleSelectionChange = useCallback(items => {
    setSelectedItems(items);
    setErrors(prev => ({...prev, keywords: ''}));
  }, []);

  const handleChangePress = useCallback(() => {
    navigation.pop(2);
  }, [navigation]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      invalidCardIndices: [],
      invalidTitleIndices: {...errors.invalidTitleIndices},
      invalidLinkIndices: {...errors.invalidLinkIndices},
      invalidImageIndices: [], // Array for indices of PRODUCT cards missing images
      keywords: '',
      commentReply: '',
    };

    // Validate carousel cards (store indices of cards with no buttons)
    const invalidCardIndices = carouselCards
      .map((card, index) => (card.button.length === 0 ? index : -1))
      .filter(index => index !== -1);
    if (invalidCardIndices.length > 0) {
      newErrors.invalidCardIndices = invalidCardIndices;
      isValid = false;
    }

    // Validate titles and links in all buttons across all cards
    const allInvalidTitleIndices = {};
    const allInvalidLinkIndices = {};
    carouselCards.forEach((card, cardIndex) => {
      const invalidTitleIndices = card.button
        .map((btn, btnIndex) =>
          !btn.title.trim() || btn.title.trim().length > 30 ? btnIndex : -1,
        )
        .filter(idx => idx !== -1);
      const invalidLinkIndices = card.button
        .map((btn, btnIndex) =>
          !btn.link.trim() || !isValidURL(btn.link.trim()) ? btnIndex : -1,
        )
        .filter(idx => idx !== -1);

      if (invalidTitleIndices.length > 0)
        allInvalidTitleIndices[cardIndex] = invalidTitleIndices;
      if (invalidLinkIndices.length > 0)
        allInvalidLinkIndices[cardIndex] = invalidLinkIndices;
    });
    if (Object.keys(allInvalidTitleIndices).length > 0) {
      newErrors.invalidTitleIndices = allInvalidTitleIndices;
      isValid = false;
    }
    if (Object.keys(allInvalidLinkIndices).length > 0) {
      newErrors.invalidLinkIndices = allInvalidLinkIndices;
      isValid = false;
    }

    // Validate images for PRODUCT cards
    if (reel?.cardType === 'PRODUCT') {
      const invalidImageIndices = carouselCards
        .map((card, index) => (!card.image.trim() ? index : -1))
        .filter(index => index !== -1);
      if (invalidImageIndices.length > 0) {
        newErrors.invalidImageIndices = invalidImageIndices;
        isValid = false;
      }
    }

    // Validate keywords if not DM to all comments
    if (!isDMToAllComment && selectedItems.length === 0) {
      newErrors.keywords = 'Please select at least one keyword.';
      isValid = false;
    }

    // Validate comment reply if enabled
    if (automaticReply && !linkSentToDM.trim()) {
      newErrors.commentReply = 'Please enter a message for automatic reply.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSavePress = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const cards = carouselCards?.map(i => {
        const update = i?.button?.map(btn => {
          return {
            title: btn.title,
            link: btn.link,
          };
        });

        return {
          button: update,
          image: i?.image,
          title: i?.title,
          subtitle: 'Powered By Mywall',
        };
      });

      const payload = {
        influencerId: onBoarding?.id,
        userId: onBoarding?.id,
        reelId: reel?.id,
        igAccountId: onBoarding?.instagramToken?.igUserId,
        thumbnailUrl: reel?.thumbnailUrl,
        isActive: true,
        isKeywordFilteredDM: !isDMToAllComment,
        keywords: selectedItems?.map(i => i.value.trim().toLowerCase()),
        isCommentReply: automaticReply,
        commentReplyText: linkSentToDM,
        permalink: reel?.permalink,
        cardType: reel?.cardType,
        cardData: cards,
        referralCode: onBoarding?.referralCode,
        ...(route.params?.details?.id && {id: route.params?.details?.id}),
      };

      const res = await updateInstagramDMItemsAPI({...payload});
      if (res?.code === 'SUCCESS') {
        if (route.params?.isFromInsight) {
          navigation.goBack();
          return;
        } else if (route.params?.details) {
          navigation.navigate('AutoDMInsights', {
            pop: 3,
          });
          return;
        } else {
          setIsVisibleAutoDMModal(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (route.params?.reel) {
      console.log('route.params?.reel', route.params?.reel)
      setReel(route.params?.reel);
    }
    if (route.params?.details) {
      const existingReel = route.params?.details;
      const formateCardData = existingReel?.cardData?.map(i => {
        const updated = i?.button?.map(btn => {
          return {...btn, isEdit: false};
        });

        return {
          ...i,
          button: updated,
          isEditing: false,
          isTitleEditing: false,
        };
      });
      setCarouselCards(formateCardData);
      setIsDMToAllComment(!existingReel?.isKeywordFilteredDM);
      setAutomaticReply(existingReel?.isCommentReply);
      setLinkSentToDM(existingReel?.commentReplyText);
      setSelectedItems(
        existingReel?.keywords?.map(i => {
          const format = i?.charAt(0).toUpperCase() + i?.slice(1).toLowerCase();
          return {
            value: format,
            label: format,
          };
        }),
      );
    }
  }, [route.params]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <DetailStackHeader
        title="Card Details"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <View className="bg-white flex-1 p-4 flex-col gap-[24]">
        <ScrollView className={'grow'} showsVerticalScrollIndicator={false}>
          <PostCard
            commentCount={reel?.commentsCount ?? 0}
            likeCount={reel?.likeCount ?? 0}
            onChangePress={handleChangePress}
            postedDate={
              reel?.timestamp ? `Posted on ${formatDate(reel.timestamp)}` : ''
            }
            title={reel?.caption ?? ''}
            imageUri={reel?.thumbnail_url}
            showChangeButton={
              reel?.commentsCount && reel?.likeCount ? true : false
            }
          />
          <View className="flex-col gap-[21] flex-1 mt-[20]">
            <View>
              {reel?.cardType === 'BUTTON' ? (
                <ButtonCardTemplate
                  carouselCards={carouselCards}
                  handleBtnInputChange={(index, btnIndex, key, text) => {
                    handleBtnInputChange(index, btnIndex, key, text);
                  }}
                  handlePaste={(index, btnIndex) =>
                    handlePaste(index, btnIndex)
                  }
                  setCarouselCards={setCarouselCards}
                  toggleEditMode={(index, btnIndex) =>
                    toggleEditMode(index, btnIndex)
                  }
                  handleAddButton={index => handleAddButton(index)}
                  handleSave={index => handleSave(index)}
                  invalidCardIndices={errors.invalidCardIndices}
                  invalidLinkIndices={errors.invalidLinkIndices}
                  invalidTitleIndices={errors.invalidTitleIndices}
                />
              ) : (
                <GenericCardTemplate
                  carouselCards={carouselCards}
                  handleAddCard={handleAddCard}
                  handleBtnInputChange={(index, btnIndex, key, text) => {
                    handleBtnInputChange(index, btnIndex, key, text);
                  }}
                  handlePaste={(index, btnIndex) =>
                    handlePaste(index, btnIndex)
                  }
                  onPickImage={index => handleImageUpload(index)}
                  setCarouselCards={setCarouselCards}
                  toggleEditMode={(index, btnIndex) =>
                    toggleEditMode(index, btnIndex)
                  }
                  handleAddButton={index => handleAddButton(index)}
                  handleSave={index => handleSave(index)}
                  invalidCardIndices={errors.invalidCardIndices}
                  invalidLinkIndices={errors.invalidLinkIndices}
                  invalidTitleIndices={errors.invalidTitleIndices}
                  invalidImageIndices={errors.invalidImageIndices}
                />
              )}
              {errors.invalidCardIndices?.length > 0 ? (
                <Text className="text-red-500 text-sm mt-2">
                  {'Each card must have at least one button.'}
                </Text>
              ) : null}
            </View>
            <View className="flex-col gap-[10]">
              <View className="flex-row gap-[18]">
                <Checkbox
                  checked={isDMToAllComment}
                  label={'DM to all comments'}
                  onChange={handleDMToAllCommentChange}
                />
                <Checkbox
                  checked={!isDMToAllComment}
                  label={'Specify Keywords'}
                  onChange={handleSpecifyKeywordsChange}
                />
              </View>
              {!isDMToAllComment && (
                <MultiSelectDropdown
                  data={options}
                  placeholder="Enter the keyword on which the DM will be triggered"
                  searchPlaceholder="Search the keyword on which the DM will be triggered"
                  onSelectionChange={handleSelectionChange}
                  maxHeight={250}
                  selectedOptions={selectedItems}
                  error={errors.keywords}
                />
              )}
            </View>
            <View className="flex-col gap-[10]">
              <View className="flex-col gap-[10]">
                <Text className="text-neutral-800 text-base font-medium">
                  Automatic comment reply
                </Text>
                <View className="flex-row gap-[30]">
                  <Checkbox
                    checked={!automaticReply}
                    label={'Disable'}
                    onChange={handleAutomaticReply}
                  />
                  <Checkbox
                    checked={automaticReply}
                    label={'Enable'}
                    onChange={handleAutomaticReply}
                  />
                </View>
              </View>

              {automaticReply && (
                <InputField
                  placeholder="Link Sent to your DM ⭐️"
                  onChangeText={handleLinkSentToDMChange}
                  value={linkSentToDM}
                  style={{padding: 8}}
                  error={errors.commentReply}
                />
              )}
            </View>
          </View>
        </ScrollView>
        <Button
          onPress={handleSavePress}
          title="Save"
          variant="primary"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
        <AutoDmModal
          onClose={() => {
            setIsVisibleAutoDMModal(false);
            setTimeout(() => {
              navigation.navigate('AutoDMInsights', {
                pop: 4,
              });
            }, 500);
          }}
          visible={isVisibleAutoDMModal}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CardDetailsScreen;
