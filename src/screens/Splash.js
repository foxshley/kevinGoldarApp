/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';

import Logo from '../assets/logo.png';

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Splash() {
  const {width, height} = useWindowDimensions();
  return (
    <View style={styles.splash}>
      <Image source={Logo} style={{width: width / 2, height: height / 2}} />
    </View>
  );
}
