// components/GradientText.js
import React from 'react';
import {Text} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({text, style, colors = ['#2ED3FA', '#8B5CF6']}) => {
  return (
    <MaskedView maskElement={<Text style={style}>{text}</Text>}>
      <LinearGradient colors={colors} start={{x: 0, y: 0}} end={{x: 0, y: 1}}>
        <Text style={[style, {opacity: 0}]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
