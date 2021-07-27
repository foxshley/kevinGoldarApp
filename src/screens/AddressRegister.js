/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {geohashForLocation} from 'geofire-common';

import Container from '../components/Container';
import FormInputField from '../components/FormInputField';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZm94c2hsZXkiLCJhIjoiY2twcXRsdWZmMDN0dDJyczFnZXV0ZnEzNyJ9.qlPjomCcSOlj2O8C_S03bg',
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: 300,
    height: 400,
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  btnNext: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnNextText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  error: {
    textAlign: 'center',
    color: '#FF5858',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 'auto',
  },
});

export default function UploadAvatar({navigation}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [geohash, setGeohash] = useState(null);
  const [error, setError] = useState('');
  const [coordinateError, setCoordinateError] = useState('');

  const formMethods = useForm();

  const onSubmitPressed = form => {
    setIsSubmitting(true);

    if (!selectedCoordinate) {
      setCoordinateError('Silahkan tambahkan lokasi anda!');
      setIsSubmitting(false);

      return;
    }

    setCoordinateError('');

    let uid = auth().currentUser.uid;

    firestore()
      .collection('users')
      .doc(uid)
      .update({
        address: form.address,
        geodata: {
          geohash: geohash,
          lat: selectedCoordinate[1],
          lng: selectedCoordinate[0],
        },
      })
      .then(() => {
        setIsSubmitting(false);
        navigation.push('UploadAvatar', {donorRole: true});
      })
      .catch(error => {
        setError(error.message);
        setIsSubmitting(false);
      });
  };

  const onSubmitError = form => {};

  const onMapPressed = feature => {
    setSelectedCoordinate(feature.geometry.coordinates);
  };

  useEffect(() => {
    if (!selectedCoordinate) return;

    let hash = geohashForLocation([
      selectedCoordinate[1],
      selectedCoordinate[0],
    ]);
    setGeohash(hash);
  }, [selectedCoordinate]);

  useEffect(() => {
    MapboxGL.locationManager.start();

    return () => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  return (
    <ScrollView>
      <Container>
        <Text style={styles.heading}>Tambahkan Alamat Anda</Text>
        <Text style={{textAlign: 'center'}}>
          Tambahkan alamat agar orang dapat menemukan anda
        </Text>
        <Text style={styles.error}>{error}</Text>
        <FormProvider {...formMethods}>
          <FormInputField
            name="address"
            placeholder="Alamat"
            autocompleteType="address"
            keyboardType="default"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            rules={{
              required: 'Alamat wajib diisi!',
              minLength: {
                message: 'Alamat terlalu pendek, minimal 10 karakter.',
                value: 10,
              },
            }}
          />
        </FormProvider>
        <Text style={{textAlign: 'center'}}>
          Tap untuk menambahkan lokasi agar orang lain dapat menemui anda
        </Text>
        <Text style={styles.error}>{coordinateError}</Text>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          onPress={onMapPressed}>
          <MapboxGL.Camera zoomLevel={12} followUserLocation={true} />
          {selectedCoordinate && (
            <MapboxGL.PointAnnotation
              id="selectedCoordinate"
              coordinate={selectedCoordinate}></MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>

        <TouchableOpacity
          style={styles.btnNext}
          onPress={formMethods.handleSubmit(onSubmitPressed, onSubmitError)}>
          <Text style={styles.btnNextText}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              'Berikutnya'
            )}
          </Text>
        </TouchableOpacity>
      </Container>
    </ScrollView>
  );
}
