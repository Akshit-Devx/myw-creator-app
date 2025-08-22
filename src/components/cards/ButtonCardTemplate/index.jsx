import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import InputField from '../../elements/Input';
import {Icons} from '../../../assets/icons';
import Button from '../../elements/Button';

const ButtonCardTemplate = ({
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
}) => {
  return (
    <>
      {carouselCards.map((item, cardIndex) => {
        const isInvalid = invalidCardIndices?.includes(cardIndex);
        return (
          <View>
            <Text className="text-lg font-medium text-neutral-[#2A2A2A]">
              Enter Card Details
            </Text>
            <View className="p-[10]">
              <View
                className={`bg-neutral-100 p-[10] rounded-xl flex-col gap-[10] ${
                  isInvalid ? 'border border-red-500' : ''
                }`}>
                {item.isTitleEditing ? (
                  <InputField
                    placeholder=""
                    onChangeText={text => {
                      const updated = [...carouselCards];
                      const record = {
                        ...carouselCards[cardIndex],
                        title: text,
                      };
                      updated[cardIndex] = record;
                      setCarouselCards(updated);
                    }}
                    value={item.title}
                    error={''}
                    style={{padding: 8}}
                  />
                ) : (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-neutral-800 text-base font-medium">
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        const updated = [...carouselCards];
                        const record = {
                          ...carouselCards[cardIndex],
                          isTitleEditing: true,
                          isEditing: true,
                        };
                        updated[cardIndex] = record;
                        setCarouselCards(updated);
                      }}
                      className="w-[20] h-[20]">
                      <Icons.EditIcon width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                )}
                {item.button?.map((button, index) => {
                  const isTitleInvalid =
                    invalidTitleIndices[cardIndex]?.includes(index);
                  const isLinkInvalid =
                    invalidLinkIndices[cardIndex]?.includes(index);
                  return (
                    <>
                      {button?.isEdit ? (
                        <View className="flex-row gap-[10]" key={`_${index}!`}>
                          <View className="flex-1">
                            <InputField
                              placeholder="Enter Button Link"
                              onChangeText={text =>
                                handleBtnInputChange(
                                  cardIndex,
                                  index,
                                  'link',
                                  text,
                                )
                              }
                              value={button.link}
                              error={
                                isLinkInvalid ? 'Please enter valid link' : ''
                              }
                              rightIcon={
                                <Icons.PasteIcon width={17} height={17} />
                              }
                              onRightIconPress={() =>
                                handlePaste(cardIndex, index)
                              }
                              style={{padding: 8}}
                            />
                          </View>
                          <View className="flex-1">
                            <InputField
                              placeholder="Enter Button Title"
                              onChangeText={text =>
                                handleBtnInputChange(
                                  cardIndex,
                                  index,
                                  'title',
                                  text,
                                )
                              }
                              value={button.title}
                              error={
                                isTitleInvalid
                                  ? 'Please enter button title'
                                  : ''
                              }
                              style={{padding: 8}}
                            />
                          </View>
                        </View>
                      ) : (
                        <View className="bg-white p-[6] rounded-lg flex-row items-center">
                          <Text className="text-[#2A2A2A] text-sm font-semibold flex-1 text-center">
                            {button.title}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              toggleEditMode(cardIndex, index);
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
                    onPress={() => handleSave(cardIndex)}
                    title={'Save'}
                    variant="unknown"
                    className="bg-neutral-900 rounded-lg"
                    textClassName="text-white font-medium text-lg"
                  />
                ) : (
                  <Button
                    onPress={() => handleAddButton(cardIndex)}
                    title={`Add new button ${item.button.length}/3`}
                    variant="unknown"
                    className="p-1 border-gray-500 border border-dotted rounded-lg"
                    textClassName="text-black-500"
                    disabled={item.button.length === 3}
                  />
                )}
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
};

export default ButtonCardTemplate;
