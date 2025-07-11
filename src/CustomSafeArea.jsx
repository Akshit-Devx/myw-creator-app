import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {useNavigationState} from '@react-navigation/native';

const excludedScreens = ['Pricing']; // Screens to exclude SafeArea

const CustomSafeArea = ({children}) => {
  const routeName = useNavigationState(state => {
    const route = state.routes[state.index];
    return route.name;
  });

  const shouldExclude = excludedScreens.includes(routeName);

  if (shouldExclude) {
    return <View style={styles.container}>{children}</View>;
  }

  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // or your app background
  },
});

export default CustomSafeArea;
