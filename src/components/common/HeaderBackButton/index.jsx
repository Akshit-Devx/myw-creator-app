import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icons} from '../../../assets/icons';

const HeaderBackButton = ({canGoBack, navigation}) => {
  if (!canGoBack) {
    return null;
  }

  return (
    <TouchableOpacity onPress={navigation.goBack} className="p-2">
      <Icons.BackIcon width={20} height={20} />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;
