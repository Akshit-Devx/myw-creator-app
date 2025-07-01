import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icons} from '../../../assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../components/elements/Button';

const MywallReferrralScreen = ({navigation}) => {
  const handlePress = () => navigation.goBack();

  const BorderWrapper = LinearGradient;
  const borderProps = {
    colors: ['#9C2CF3', '#1A47E8'],
    start: {x: 0, y: 0},
    end: {x: 1, y: 0},
  };

  return (
    <View className="flex-1 bg-white p-5">
      <TouchableOpacity
        onPress={handlePress}
        className="p-2 border border-black rounded-xl self-start mb-6">
        <Icons.BackIcon width={20} height={20} />
      </TouchableOpacity>
      <Icons.Wallet width={'100%'} />
      <Text className="text-center text-[22px] font-medium mt-4 text-gray-900">
        Mywall Referral Program
      </Text>
      <Text className="text-center text-4xl font-semibold mt-4">
        💰 Refer & Earn 💰
      </Text>
      <Text className="text-center text-lg font-normal mt-4">
        Earn ₹50/month per active referral. You can earn up-to{' '}
        <Text className="font-semibold">₹50,000/Month</Text>
      </Text>
      <TouchableOpacity onPress={() => {}} className="self-center mt-6">
        <LinearGradient
          colors={['#2ED3FA', '#8B5CF6']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          className="p-[1px]">
          <View className="bg-white flex-row items-center m-[1px] items-center justify-center gap-3 px-6 py-2">
            <Icons.VideoGradient width={25} height={25} />
            <Text className="text-[20px] font-medium text-[#8B5CF6]">
              How it works
            </Text>
            {/* <GradientText
              text="How it works"
              style={{
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 30,
              }}
            /> */}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <Text className="text-xl text-center font-medium mt-10">
        Invite via your referral code
      </Text>
      <View className="border-dashed border-gray-300 rounded-xl flex-row justify-between items-center border bg-[#F6F8FA] px-6 py-4 mt-4">
        <View className="flex-col items-start gap-1">
          <Text className="text-lg text-center font-medium text-gray-800">
            www.mywall.me/
          </Text>
          <Text className="text-3xl text-center font-bold text-gray-800">
            09RL3
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Icons.CopyRoundedIcon height={40} width={40} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icons.ShareRoundedIcon height={40} width={40} />
          </TouchableOpacity>
        </View>
      </View>
      <Button
        title={'Go to Referral Dashboard'}
        variant="secondary"
        size="lg"
        className="mt-10 rounded-xl border-['#1946E7'] h-14"
        textClassName="text-[#3B77F6] text-xl"
        onPress={() => navigation.navigate('ReferralDashboard')}
      />
    </View>
  );
};

export default MywallReferrralScreen;
