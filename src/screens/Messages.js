/**
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { View, Text, StyleSheet } from 'react-native';
 
 const styles = StyleSheet.create({
   splash: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center'
   }
 });
 
 export default function Messages() {
   return (
     <View style={styles.splash}>
         <Text>Loading...</Text>
     </View>
   );
 }