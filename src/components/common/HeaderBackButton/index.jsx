import {TouchableOpacity} from 'react-native';
import {Icons} from '../../../assets/icons';

const HeaderBackButton = ({canGoBack, navigation, onPress}) => {
  if (!canGoBack) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="p-2">
      <Icons.BackIcon width={20} height={20} />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;
