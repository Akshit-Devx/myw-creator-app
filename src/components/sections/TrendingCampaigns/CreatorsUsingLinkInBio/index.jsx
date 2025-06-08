import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import {Icons} from '../../../../assets/icons';
import {getBrandMediaURL} from '../../../../utility/helper';

export const creatorProfiles = [
  {
    id: 1,
    username: 'tm.twins',
    name: 'Taneeyah & Meniyah',
    avatar: 'public/static-assets/tm-twins.webp',
    posts: '159',
    followers: '1.3 M',
    following: '959',
    location: 'Mass Media Arts Majors@cau1988',
    link: 'https://mywall.me/tm.twinsllc',
  },
  {
    id: 2,
    username: 'realgreatstyles',
    name: 'Stylez DaVinci',
    avatar: 'public/static-assets/realgreatstyles.webp',
    posts: '314',
    followers: '1 M',
    following: '7,506',
    location: 'G̾R̾E̾A̾T̾E̾S̾T̾ ̾S̾T̾Y̾L̾E̾S̾ ̾E̾V̾E̾R̾R̾ ̾L̾I̾V̾E̾D̾ ↙️',
    link: 'https://mywall.me/realgreatstyles',
  },
  {
    id: 3,
    username: 'archana.93',
    name: 'Archana S Nair',
    avatar: 'public/static-assets/archana-s-nair.webp',
    posts: '835',
    followers: '628K',
    following: '1,455',
    location: '10+ Years Creating Content ↙️',
    link: 'https://mywall.me/archana',
  },
  {
    id: 4,
    username: 'classsy_vogue',
    name: 'Nitesh Yadav',
    avatar: 'public/static-assets/nitesh-yadav.webp',
    posts: '2,773',
    followers: '5.5 M',
    following: '150',
    location: 'Fashion ! Travel ! Lifestyle ↙️',
    link: 'https://mywall.me/nitesh',
  },
  {
    id: 5,
    username: 'allen_choudhary',
    name: 'Allen Choudhary',
    avatar: 'public/static-assets/allen-choudhary.webp',
    posts: '1,396',
    followers: '1.4 M',
    following: '276',
    location: 'Helping you in Enhancing ✨Fashion ↙️',
    link: 'https://mywall.me/allen_chaudhary',
  },
  {
    id: 6,
    username: 'ruthmaingi',
    name: 'Ruth Ndulu Maingi',
    avatar: 'public/static-assets/ruth-ndulu-maingi.webp',
    posts: '744',
    followers: '574K',
    following: '1,042',
    location: 'London academy for film and Television ↙️',
    link: 'https://mywall.me/ruth',
  },
  {
    id: 7,
    username: 'shivoryx',
    name: 'Shivam Sharma',
    avatar: 'public/static-assets/shivam-sharma.webp',
    posts: '1,138',
    followers: '797K',
    following: '153',
    location: 'Traveler / Filmmaker & A Singer by profession↙️',
    link: 'https://mywall.me/shivamsharma',
  },
];

const creatorCard = creator => {
  return (
    <View className="border border-indigo-600 rounded-xl overflow-hidden flex-col gap-4 p-4">
      <Text className="text-lg font-semibold">{creator.username}</Text>
      <View className="flex-row items-center gap-4">
        <Image
          source={{uri: getBrandMediaURL(creator.avatar)}}
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-col gap-2">
          <Text className="font-semibold">{creator?.name}</Text>
          <View className="flex-row gap-4">
            <View className="flex-col items-center gap-1">
              <Text className="text-xs">{creator?.posts}</Text>
              <Text className="text-xs">Posts</Text>
            </View>
            <View className="flex-col items-center gap-1">
              <Text className="text-xs">{creator?.followers}</Text>
              <Text className="text-xs">Followers</Text>
            </View>
            <View className="flex-col items-center gap-1">
              <Text className="text-xs">{creator?.following}</Text>
              <Text className="text-xs">Following</Text>
            </View>
          </View>
        </View>
      </View>
      <Text className="text-sm">{creator?.location}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(creator?.link)}>
        <Text className="text-indigo-600 text-sm font-semibold bg-white border border-indigo-600 px-2 py-1.5 rounded-full text-center">
          {creator?.link}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const CreatorsUsingLinkInBioSection = () => {
  return (
    <View className="flex-col gap-8">
      <View className="flex-row justify-center items-center gap-2">
        <Icons.LeftGradientLine height={24} width={60} />
        <Text className="text-center text-xl font-semibold">
          CREATORS USING OUR LINK IN BIO
        </Text>
        <Icons.RightGradientLine height={24} width={60} />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-5 px-1"
        data={creatorProfiles}
        keyExtractor={(item, index) => item?.id + index}
        renderItem={({item: creator}) => creatorCard(creator)}
      />
    </View>
  );
};

export default CreatorsUsingLinkInBioSection;
