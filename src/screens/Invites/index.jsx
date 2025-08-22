import {View, Text} from 'react-native';
import DetailStackHeader from '../../components/common/DetailStackHeader';


const InvitesScreen = ({navigation}) => {
  return (
    <View className="flex-1 bg-white">
      <DetailStackHeader
        title="Invites"
        onLeftPress={() => navigation.goBack()}
        showRightButton={false}
      />
      <Text>InvitesScreen</Text>
    </View>
  );
};

export default InvitesScreen;
