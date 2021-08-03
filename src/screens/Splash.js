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
    backgroundColor: '#d13636',
  },
});

export default function Splash() {
  return (
    <View style={styles.splash}>
      <Image
        source={Logo}
        style={{width: 200, height: 200, borderRadius: 100}}
      />
    </View>
  );
}
