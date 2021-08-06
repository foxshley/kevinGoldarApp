/**
 * @format
 * @flow strict-local
 */

import React, {useEffect, useContext} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

import auth from '@react-native-firebase/auth';
import AuthContext from '../contexts/AuthContext';

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Logout() {
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      auth()
        .signOut()
        .then(() => signOut());
    }, 1000);
  }, []);

  return (
    <View style={styles.splash}>
      <Text style={{fontSize: 24, marginBottom: 40}}>Logging out...</Text>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  );
}
