import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';

import Button from '../../elements/Button';
import InputField from '../../elements/Input';
import { Icons } from '../../../assets/icons';
import { getMediaURL } from '../../../utility/helper';

const GenericCardTemplate = ({
  handleAddCard,
  onPickImage,
  setCarouselCards,
  carouselCards,
  handleBtnInputChange,
  toggleEditMode,
  handlePaste,
  handleAddButton,
  handleSave,
  invalidCardIndices,
  invalidLinkIndices,
  invalidTitleIndices,
  invalidImageIndices,
}) => {
  const renderCarouselItem = ({item, index}) => {
    const isInvalid = invalidCardIndices?.includes(index);
    const isImageInvalid = invalidImageIndices.includes(index);
    return (
      <View
        className={`bg-[#EFEFEF] rounded-xl overflow-hidden  w-[230] ${
          isInvalid ? 'border border-red-500' : ''
        }`}
        key={`@_${index}`}>
        {item?.image ? (
          <View className="w-[230] h-[172] relative">
            <Image
              source={{
                uri: getMediaURL(item.image),
              }}
              className="w-[230] h-[172] rounded-t-xl"
            />
            <TouchableOpacity
              onPress={() => onPickImage(index)}
              className="absolute top-4 right-4">
              <Icons.CameraIcon width={26} height={26} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-[230] h-[172] bg-[#EFF1F9] justify-center items-center px-2">
            <TouchableOpacity
              onPress={() => onPickImage(index)}
              activeOpacity={0.8}
              className="justify-center items-center flex-row gap-[10]">
              <Icons.UploadIcon width={20} height={20} />
              <Text className="text-[#406AFF] text-sm">Upload Photo</Text>
            </TouchableOpacity>
            {isImageInvalid && (
              <Text className="text-red-500 text-sm text-center mt-2">
                An image is required for this PRODUCT card. Please upload an
                image.
              </Text>
            )}
          </View>
        )}
        <View className="p-[10] flex-col gap-[6]">
          <View>
            {item.isTitleEditing ? (
              <InputField
                placeholder=""
                onChangeText={text => {
                  const updated = [...carouselCards];
                  const record = {
                    ...carouselCards[index],
                    title: text,
                  };
                  updated[index] = record;
                  setCarouselCards(updated);
                }}
                value={item.title}
                error={''}
                style={{padding: 8}}
              />
            ) : (
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-neutral-800 text-base font-medium w-[180]"
                  numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...carouselCards];
                    const record = {
                      ...carouselCards[index],
                      isTitleEditing: true,
                      isEditing: true,
                    };
                    updated[index] = record;
                    setCarouselCards(updated);
                  }}
                  className="w-[20] h-[20]">
                  <Icons.EditIcon width={20} height={20} />
                </TouchableOpacity>
              </View>
            )}
            <Text className="text-[#2A2A2A] font-medium text-xs">
              Powered By Mywall
            </Text>
          </View>
          {item.button?.map((link, btnIndex) => {
            const isTitleInvalid =
              invalidTitleIndices[index]?.includes(btnIndex);
            const isLinkInvalid = invalidLinkIndices[index]?.includes(btnIndex);
            return (
              <>
                {link.isEdit ? (
                  <View className="flex-col gap-[8]">
                    <InputField
                      placeholder="Enter Button Title"
                      onChangeText={text => {
                        handleBtnInputChange(index, btnIndex, 'title', text);
                      }}
                      value={link.title}
                      error={isTitleInvalid ? 'Please enter button title' : ''}
                      style={{padding: 8}}
                    />
                    <InputField
                      placeholder="Enter Button Link"
                      onChangeText={text => {
                        handleBtnInputChange(index, btnIndex, 'link', text);
                      }}
                      value={link.link}
                      error={isLinkInvalid ? 'Please enter valid link' : ''}
                      rightIcon={<Icons.PasteIcon width={17} height={17} />}
                      onRightIconPress={() => {
                        handlePaste(index, btnIndex);
                      }}
                      style={{padding: 8}}
                    />
                  </View>
                ) : (
                  <View className="bg-white p-[6] rounded-lg flex-row justify-evenly items-center">
                    <Text className="text-[#2A2A2A] text-sm font-semibold flex-1 text-center">
                      {link.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        toggleEditMode(index, btnIndex);
                      }}
                      className="w-[20] h-[20]">
                      <Icons.EditIcon width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            );
          })}

          {item.isEditing ? (
            <Button
              onPress={() => handleSave(index)}
              title={'Save'}
              variant="unknown"
              className="bg-neutral-900 rounded-lg"
              textClassName="text-white font-medium text-lg"
            />
          ) : (
            <Button
              onPress={() => handleAddButton(index)}
              title={`Add new button ${item.button.length}/3`}
              variant="unknown"
              className="p-1 border-gray-500 border border-dotted rounded-lg"
              textClassName="text-black-500"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-row items-center gap-[12] w-full">
      <FlatList
        data={carouselCards}
        renderItem={renderCarouselItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 16}}
        keyExtractor={(item, index) => {
          `_!${index}`;
        }}
        ListFooterComponent={() => {
          return (
            <TouchableOpacity
              onPress={handleAddCard}
              className="bg-[#DBE5F9] rounded-xl overflow-hidden w-[210] h-[318]">
              <View className="h-[218] justify-center items-center">
                <Text className="text-[#406AFF] text-sm">+ Add New Card</Text>
              </View>
              <View className="h-[100] bg-[#CFD9EF] justify-center items-center">
                <View className="h-[40] w-[145] border-t-2 border-b-2 border-black" />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default GenericCardTemplate;
