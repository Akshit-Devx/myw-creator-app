import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {Icons} from '../../assets/icons';
import TopNav from '../../components/layouts/TopNav';
import LinearGradient from 'react-native-linear-gradient';
import {getInstagramDmByInfluencerId} from '../../services/handleApi';
import {useSelector} from 'react-redux';
import {formatToKOrM} from '../../utility/helper';
import {getPublicURL} from '../../utility/getPublicImageUrl';

const AutoDMDashboard = ({navigation}) => {
  const {onBoarding} = useSelector(state => state?.onBoarding);

  const [selectedFilter, setSelectedFilter] = useState('Newest First');
  const [reelsList, setReelsList] = useState([]);
  const [totalDM, setTotalDM] = useState(0);

  const sortReels = e => {
    setSelectedFilter(e);
    const sortedReels = [...reelsList];
    sortedReels.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return e === 'Newest First'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });
    setReelsList(sortedReels);
  };

  useEffect(() => {
    getAllReels();
  }, []);

  const getAllReels = async () => {
    try {
      const response = await getInstagramDmByInfluencerId(onBoarding?.id);
      setReelsList(response);

      const totalComments = response.reduce((total, reel) => {
        return total + (reel.commentsList ? reel.commentsList.length : 0);
      }, 0);

      setTotalDM(totalComments);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleToggle = async reel => {
    try {
      const updatedReelList = reelsList.map(item =>
        item.id === reel.id ? {...item, isActive: !item.isActive} : item,
      );
      setReelsList(updatedReelList);

      // const payload = {
      //   id: reel?.id,
      //   isActive: !reel?.isActive,
      // };
      // await updateInstagramDm(payload);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8] px-5 pt-2">
      <TopNav />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="mt-2 mb-4">
        <Text className="text-[#1677ff] text-[14px] ">{'< Back'}</Text>
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-[26px] font-bold text-black mb-4">
          Auto DM Dashboard
        </Text>

        <LinearGradient
          colors={['#c0a7ff', '#662eff', '#0af3ff']}
          start={{x: 0, y: 0}}
          style={{borderRadius: 12}}
          end={{x: 1, y: 0}}>
          <View className="p-4 gap-[0.5rem]">
            <Text className="text-[14px] font-bold color-white">
              Total Messages Sent
            </Text>
            <Text className="text-[26px] font-bold color-white">{totalDM}</Text>
          </View>
        </LinearGradient>

        <View className="w-full rounded-xl overflow-hidden my-6">
          <View className="flex-row items-center mb-4 justify-between">
            <Text className="text-xl font-semibold text-black ">
              Selected Reels
            </Text>
            <Menu>
              <MenuTrigger style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text className="text-[14px] mr-2">{selectedFilter}</Text>
                <Icons.ChevronDown height={20} width={20} />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: 20,
                  },
                }}
                optionsContainerStyle={{borderRadius: 8, width: 150}}>
                <MenuOption
                  onSelect={() => sortReels('Newest First')}
                  style={
                    selectedFilter == 'Newest First' && {
                      backgroundColor: '#E9F4FE',
                      borderRadius: 4,
                      margin: 4,
                    }
                  }>
                  <Text
                    className={`text-black text-[14px] ${
                      selectedFilter === 'Newest First'
                        ? 'font-bold'
                        : 'font-medium'
                    }`}>
                    Newest First
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => sortReels('Oldest First')}
                  style={
                    selectedFilter == 'Oldest First' && {
                      backgroundColor: '#E9F4FE',
                      borderRadius: 4,
                      margin: 4,
                    }
                  }>
                  <Text
                    className={`text-black text-[14px] ${
                      selectedFilter === 'Oldest First'
                        ? 'font-bold'
                        : 'font-medium'
                    }`}>
                    Oldest First
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View className="flex-row justify-between rounded-[8px] bg-[#eff2f5] py-[6px] px-[16px] mb-2">
            <Text className="text-[16px] text-black">Reels</Text>
            <Text className="text-[16px] text-black">DM's Sent</Text>
            <Text className="text-[16px] text-black">Status</Text>
          </View>

          <View style={{}}>
            {reelsList?.map((reel, index) => {
              <View style={styles.tableBody}>
                {/* Thumbnail and Edit icon */}
                <View style={styles.reelThumbnail}>
                  <Image
                    source={{uri: getPublicURL(reel?.thumbnailUrl)}}
                    style={styles.thumbnailImage}
                  />
                  <TouchableOpacity
                    style={styles.editIcon}
                    onPress={() => {
                      // navigation.navigate('CardDetails', {
                      //   reelId: reel?.reelId,
                      // })
                    }}>
                    {/* <EditIcon width={16} height={16} color="#fff" /> */}
                  </TouchableOpacity>
                </View>

                {/* DM count and card type */}
                <View style={styles.dmCount}>
                  <Text style={styles.count}>
                    {reel?.commentsList?.length
                      ? formatToKOrM(reel?.commentsList?.length)
                      : '0'}
                  </Text>
                  <Text style={styles.cardType}>{reel?.cardType}</Text>
                </View>

                {/* Toggle switch */}
                <TouchableOpacity
                  style={styles.toggleSwitch}
                  onPress={() => handleToggle(reel)}>
                  <Text style={[styles.switch, !reel?.isActive && styles.off]}>
                    Off
                  </Text>
                  <Text style={[styles.switch, reel?.isActive && styles.on]}>
                    On
                  </Text>
                </TouchableOpacity>
              </View>;
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AutoDMDashboard;
