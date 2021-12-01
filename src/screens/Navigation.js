import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/core';
import MapboxNavigation from '@homee/react-native-mapbox-navigation';

export default function Navigation({navigation}) {
  const route = useRoute();
  const origin = route.params.currentPos;
  const destination = route.params.donor.geometry.coordinates;

  return (
    <View style={styles.container}>
      <MapboxNavigation
        origin={origin}
        destination={destination}
        showsEndOfRouteFeedback={true}
        onCancelNavigation={() => navigation.goBack()}
        onArrive={() => {
          // Called when you arrive at the destination.
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
