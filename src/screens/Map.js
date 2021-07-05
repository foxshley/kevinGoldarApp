/**
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZm94c2hsZXkiLCJhIjoiY2twcXRsdWZmMDN0dDJyczFnZXV0ZnEzNyJ9.qlPjomCcSOlj2O8C_S03bg',
);
 
const styles = StyleSheet.create({
  map: {
    flex: 1,
  },  
});

const data = [
  {
    id: 293820938,
    coordinate: [107.8481798, -6.9958435],
    bloodType: 'B'
  },
  {
    id: 293820939,
    coordinate: [107.8499796, -6.9958222],
    bloodType: 'A'
  },
  {
    id: 293820940,
    coordinate: [107.8494556, -6.9965806],
    bloodType: 'O'
  },
];

export default function Home() {
  const [donors, setDonors] = useState([]);

  const fetchDonors = () => {
    setDonors(data);
  };

  useEffect(() => {
    MapboxGL.locationManager.start();
    fetchDonors();

    return () => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  return (
    <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
      <MapboxGL.Camera zoomLevel={12} followUserLocation={true} />
      <MapboxGL.UserLocation />
      {donors.map(donor => (
        <MapboxGL.PointAnnotation
        coordinate={donor.coordinate}
        id={donor.id.toString()}
        title={donor.bloodType}>
          <MapboxGL.Callout title={donor.bloodType} />
        </MapboxGL.PointAnnotation>
      ))}
    </MapboxGL.MapView>
  );
};