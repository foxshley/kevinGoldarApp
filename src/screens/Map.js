/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from '@react-native-community/geolocation';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {geohashQueryBounds, distanceBetween} from 'geofire-common';

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
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
    zIndex: 99,
  },
});

const symbolStyles = {
  bloodAPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodAPlusIcon,
  },
  bloodBPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodBPlusIcon,
  },
  bloodABPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodABPlusIcon,
  },
  bloodOPlusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodOPlusIcon,
  },
  bloodAMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodAMinusIcon,
  },
  bloodBMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodBMinusIcon,
  },
  bloodABMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodABMinusIcon,
  },
  bloodOMinusStyle: {
    iconAllowOverlap: true,
    iconAnchor: 'bottom',
    iconSize: 0.2,
    iconImage: bloodOMinusIcon,
  },
};

export default function Map({navigation}) {
  const [donorsSource, setDonorsSource] = useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [selectedDonor, setSelectedDonor] = useState();
  const [currentPos, setCurrentPos] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [watchPosID, setWatchPosID] = useState(null);

  const getBloodTypeIcon = bloodType => {
    switch (bloodType) {
      case 'A+':
        return 'a-plus';
      case 'A-':
        return 'a-minus';
      case 'B+':
        return 'b-plus';
      case 'B-':
        return 'b-minus';
      case 'AB+':
        return 'ab-plus';
      case 'AB-':
        return 'ab-minus';
      case 'O+':
        return 'o-plus';
      case 'O-':
        return 'o-minus';
      default:
        break;
    }

    return null;
  };

  const fetchDonors = async () => {
    // Find cities within 50km of London
    const center = [...currentPos].reverse();
    const radiusInM = 25 * 1000;

    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    const bounds = geohashQueryBounds(center, radiusInM);

    const snapshots = [];

    for (const b of bounds) {
      const q = firestore()
        .collection('users')
        .where('geodata.active', '==', true)
        .orderBy('geodata.geohash')
        .startAt(b[0])
        .endAt(b[1]);

      snapshots.push(q.get());
    }

    Promise.all(snapshots).then(snaps => {
      // Collect all the query results together into a single list
      const geoJson = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const snap of snaps) {
        for (const doc of snap.docs) {
          let docData = doc.data();
          const lat = docData.geodata.lat;
          const lng = docData.geodata.lng;
          // console.log('Lat: ' + lat + ', Lng: ' + lng);
          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            geoJson.features.push({
              type: 'Feature',
              id: doc.id,
              properties: {
                icon: getBloodTypeIcon(docData.bloodType),
                name: docData.name,
                address: docData.address,
                bloodType: docData.bloodType,
              },
              geometry: {
                type: 'Point',
                coordinates: [docData.geodata.lng, docData.geodata.lat],
              },
            });
          }
        }
      }

      setDonorsSource(geoJson);
      setIsDataFetched(true);
    });
  };

  const onPinPress = e => {
    if (e?.features?.length > 0) {
      const feature = e?.features[0];
      setSelectedDonor(feature);
    }
  };

  const onMapPress = () => {
    if (selectedDonor) {
      setSelectedDonor(null);
    }
  };

  useEffect(() => {
    MapboxGL.locationManager.start();

    Geolocation.getCurrentPosition(info => {
      setCurrentPos([info.coords.longitude, info.coords.latitude]);
    });
    setWatchPosID(
      Geolocation.watchPosition(info =>
        setCurrentPos([info.coords.longitude, info.coords.latitude]),
      ),
    );

    return () => {
      MapboxGL.locationManager.stop();
      Geolocation.clearWatch(watchPosID);
    };
  }, []);

  useEffect(() => {
    if (!(currentPos.length === 0)) {
      if (!isDataFetched) fetchDonors();
    }
  }, [currentPos]);

  return (
    <View style={{flex: 1}}>
      {!isDataFetched && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="small"
          color="#0000ff"
        />
      )}
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onPress={onMapPress}>
        <MapboxGL.Camera zoomLevel={12} followUserLocation={true} />
        <MapboxGL.UserLocation />
        <MapboxGL.ShapeSource
          id="mapDonorSource"
          shape={donorsSource}
          onPress={onPinPress}>
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
        {selectedDonor && (
          <MapboxGL.MarkerView
            id="selectedDonorMarkerView"
            coordinate={selectedDonor.geometry.coordinates}>
            <DonorCalloutView
              donor={selectedDonor}
              onMessagePress={() => {}}
              onNavigatePress={() => {
                navigation.push('Navigation', {
                  donor: selectedDonor,
                  currentPos: currentPos,
                });
              }}
            />
          </MapboxGL.MarkerView>
        )}
      </MapboxGL.MapView>
    </View>
  );
}
