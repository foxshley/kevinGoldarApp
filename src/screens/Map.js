/**
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';

import DonorCalloutView from '../components/DonorCalloutView';

import bloodAPlusIcon from '../assets/a-plus.png';
import bloodBPlusIcon from '../assets/b-plus.png';
import bloodABPlusIcon from '../assets/ab-plus.png';
import bloodOPlusIcon from '../assets/o-plus.png';
import bloodAMinusIcon from '../assets/a-minus.png';
import bloodBMinusIcon from '../assets/b-minus.png';
import bloodABMinusIcon from '../assets/ab-minus.png';
import bloodOMinusIcon from '../assets/o-minus.png';



MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZm94c2hsZXkiLCJhIjoiY2twcXRsdWZmMDN0dDJyczFnZXV0ZnEzNyJ9.qlPjomCcSOlj2O8C_S03bg',
);
 
const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});

const symbolStyles = {
  bloodAPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodAPlusIcon
  },
  bloodBPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodBPlusIcon
  },
  bloodABPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodABPlusIcon
  },
  bloodOPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodOPlusIcon
  },
  bloodAMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodAMinusIcon
  },
  bloodBMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodBMinusIcon
  },
  bloodABMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodABMinusIcon
  },
  bloodOMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodOMinusIcon
  }
}

const geoJsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '6cd3ee33-e40a-4bb9-b960-7c6891f380de',
      properties: {
        icon: 'b-plus',
        bloodType: 'B+'
      },
      geometry: {
        type: 'Point',
        coordinates: [107.8481798, -6.9958435]
      }
    },
    {
      type: 'Feature',
      id: 'debd420d-b7bf-4dd1-b468-9d936a369ab5',
      properties: {
        icon: 'a-minus',
        bloodType: 'A-'
      },
      geometry: {
        type: 'Point',
        coordinates: [107.8499796, -6.9958222]
      }
    },
    {
      type: 'Feature',
      id: 'dbd8ac7b-9213-4fc3-aa11-abbda99405a0',
      properties: {
        icon: 'o-plus',
        bloodType: 'O+'
      },
      geometry: {
        type: 'Point',
        coordinates: [107.8494556, -6.9965806]
      }
    },
    {
      type: 'Feature',
      id: '57b9d303-288c-4a98-ab2e-85e5643fa99d',
      properties: {
        icon: 'a-plus',
        bloodType: 'A+'
      },
      geometry: {
        type: 'Point',
        coordinates: [107.83874, -6.98624]
      }
    },
    {
      type: 'Feature',
      id: '87e8c881-5744-412e-908b-bee0991b5933',
      properties: {
        icon: 'a-plus',
        bloodType: 'A+'
      },
      geometry: {
        type: 'Point',
        coordinates: [107.84874, -6.98424]
      }
    },
  ]
}

export default function Map({ navigation }) {
  const [donorsSource, setDonorsSource] = useState();
  const [selectedDonor, setSelectedDonor] = useState();
  const [currentPos, setCurrentPos] = useState([]);
  const [watchPosID, setWatchPosID] = useState(null);

  const fetchDonors = () => {
    setDonorsSource(geoJsonData);
  };

  const onPinPress = (e) => {
    if(e?.features?.length > 0) {
      const feature = e?.features[0];
      setSelectedDonor(feature);
    }
  }

  useEffect(() => {
    MapboxGL.locationManager.start();
    fetchDonors();

    Geolocation.getCurrentPosition((info) => {
      setCurrentPos([info.coords.longitude, info.coords.latitude]);
    });
    setWatchPosID(Geolocation.watchPosition((info) => setCurrentPos([info.coords.longitude, info.coords.latitude])));

    return () => {
      MapboxGL.locationManager.stop();
      Geolocation.clearWatch(watchPosID);
    };
  }, []);

  return (
    <MapboxGL.MapView style={styles.map} styleURL={MapboxGL.StyleURL.Street}>
      <MapboxGL.Camera zoomLevel={12} followUserLocation={true} />
      <MapboxGL.UserLocation />
      <MapboxGL.ShapeSource
        id="mapDonorSource"
        shape={donorsSource}
        onPress={onPinPress}
      >
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-a-plus"
          style={symbolStyles.bloodAPlusStyle}
          filter={['==', 'icon', 'a-plus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-b-plus"
          style={symbolStyles.bloodBPlusStyle}
          filter={['==', 'icon', 'b-plus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-ab-plus"
          style={symbolStyles.bloodABPlusStyle}
          filter={['==', 'icon', 'ab-plus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-o-plus"
          style={symbolStyles.bloodOPlusStyle}
          filter={['==', 'icon', 'o-plus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-a-minus"
          style={symbolStyles.bloodAMinusStyle}
          filter={['==', 'icon', 'a-minus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-b-minus"
          style={symbolStyles.bloodBMinusStyle}
          filter={['==', 'icon', 'b-minus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-ab-minus"
          style={symbolStyles.bloodABMinusStyle}
          filter={['==', 'icon', 'ab-minus']}
        />
        <MapboxGL.SymbolLayer 
          id="map-donor-layer-o-minus"
          style={symbolStyles.bloodOMinusStyle}
          filter={['==', 'icon', 'o-minus']}
        />

      </MapboxGL.ShapeSource>
      {selectedDonor && <MapboxGL.MarkerView
          id="selectedDonorMarkerView"
          coordinate={selectedDonor.geometry.coordinates}
        >
          <DonorCalloutView 
            donor={selectedDonor}
            onPress={ () => setSelectedDonor(null) } 
            onMessagePress={() => {}} 
            onNavigatePress={() => { navigation.push('Navigation', { donor: selectedDonor, currentPos: currentPos }) }} 
          />
        </MapboxGL.MarkerView>
      }

    </MapboxGL.MapView>
  );
};