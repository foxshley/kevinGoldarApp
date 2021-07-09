/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Splash() {
  return (
    <View style={styles.splash}>
      <Text>Loading...</Text>
    </View>
  );
}
