/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {FormProvider, useForm} from 'react-hook-form';
import {geohashForLocation} from 'geofire-common';
import MapboxGL from '@react-native-mapbox-gl/maps';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PersonImg from '../assets/person.png';

import Container from '../components/Container';
import CheckBox from '@react-native-community/checkbox';
import FormInputField from '../components/FormInputField';
import FormBloodTypePicker from '../components/FormBloodTypePicker';

import AuthContext from '../contexts/AuthContext';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoiZm94c2hsZXkiLCJhIjoiY2twcXRsdWZmMDN0dDJyczFnZXV0ZnEzNyJ9.qlPjomCcSOlj2O8C_S03bg',
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fieldName: {
    textAlign: 'left',
  },
  btnSave: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnSaveText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  btnLogout: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#303030',
  },
  btnLogoutText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  status: {
    color: 'green',
    marginVertical: 10,
  },
  map: {
    flex: 1,
    width: 300,
    height: 400,
    marginTop: 20,
  },
});

export default function Home() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDonor, setIsDonor] = useState(false);
  const [isActiveDonor, setIsActiveDonor] = useState(true);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [geohash, setGeohash] = useState(null);
  const [status, setStatus] = useState('');
  const scrollRef = useRef(null);

  const formMethods = useForm();

  const {signOut} = useContext(AuthContext);

  const logout = () => {
    auth()
      .signOut()
      .then(() => signOut());
  };

  const setInitialData = () => {
    (async () => {
      const uid = auth().currentUser.uid;
      const photo = auth().currentUser.photoURL;
      const doc = await firestore().collection('users').doc(uid).get();

      setStatus('');
      setName(doc.data().name);
      if (photo) setPhoto(photo);
      formMethods.setValue('name', doc.data().name);
      formMethods.setValue('email', doc.data().email);
      formMethods.setValue('bloodType', doc.data().bloodType);

      if (doc.data().geodata) {
        setIsDonor(true);
        setSelectedCoordinate([doc.data().geodata.lng, doc.data().geodata.lat]);
        setIsActiveDonor(doc.data().geodata.active);

        setTimeout(
          () => formMethods.setValue('address', doc.data().address),
          1000,
        );
      }
    })();
  };

  const onSavePressed = form => {
    (async () => {
      setIsSaving(true);
      try {
        const uid = auth().currentUser.uid;

        await auth().currentUser.updateProfile({
          displayName: form.name,
        });

        await firestore().collection('users').doc(uid).update({
          name: form.name,
          email: form.email,
          bloodType: form.bloodType,
        });

        if (isDonor) {
          await firestore()
            .collection('users')
            .doc(uid)
            .update({
              address: form.address,
              geodata: {
                geohash: geohash,
                lat: selectedCoordinate[1],
                lng: selectedCoordinate[0],
                active: isActiveDonor,
              },
            });
        }

        scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
        setIsSaving(false);
        setStatus('Data telah disimpan!');
        // navigation.push('RoleChoose');
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const onSaveError = form => {};

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
    setInitialData();
    MapboxGL.locationManager.start();

    return () => {
      MapboxGL.locationManager.stop();
    };
  }, []);

  return (
    <ScrollView ref={scrollRef}>
      <View style={styles.container}>
        <Text style={styles.heading}>Profile</Text>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photo} />
        ) : (
          <Image source={PersonImg} style={styles.photo} />
        )}
        <Text style={styles.status}>{status}</Text>
        <FormProvider {...formMethods}>
          <View>
            <Text style={styles.fieldName}>Nama:</Text>
            <FormInputField
              name="name"
              placeholder="Nama"
              autocompleteType="name"
              keyboardType="default"
              returnKeyType="next"
              returnKeyLabel="next"
              rules={{
                required: 'Nama wajib diisi!',
                minLength: {
                  message: 'Nama terlalu pendek, minimal 3 karakter.',
                  value: 3,
                },
                pattern: {
                  value: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                  message: 'Nama tidak valid!',
                },
              }}
              // onChangeText={nama => setNama(nama)}
            />
          </View>
          <View>
            <Text>Email:</Text>
            <FormInputField
              name="email"
              placeholder="Email"
              autocompleteType="email"
              keyboardType="email-address"
              returnKeyType="next"
              returnKeyLabel="next"
              rules={{
                required: 'Email wajib diisi!',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Email tidak valid!',
                },
              }}
              // onChangeText={email => setEmail(email)}
            />
          </View>
          <View>
            <Text>Golongan Darah:</Text>
            <FormBloodTypePicker
              name="bloodType"
              rules={{
                required: 'Golongan darah wajib dipilih!',
              }}
            />
          </View>

          {isDonor && (
            <>
              <View>
                <Text>Alamat:</Text>
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
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{lineHeight: 30}}>Donatur Aktif:</Text>
                <CheckBox
                  value={isActiveDonor}
                  onValueChange={newVal => setIsActiveDonor(newVal)}
                />
              </View>
              <MapboxGL.MapView
                style={styles.map}
                styleURL={MapboxGL.StyleURL.Street}
                onPress={onMapPressed}>
                <MapboxGL.Camera
                  zoomLevel={12}
                  centerCoordinate={selectedCoordinate}
                />
                {selectedCoordinate && (
                  <MapboxGL.PointAnnotation
                    id="selectedCoordinate"
                    coordinate={selectedCoordinate}></MapboxGL.PointAnnotation>
                )}
              </MapboxGL.MapView>
            </>
          )}
          <TouchableOpacity
            style={styles.btnSave}
            onPress={formMethods.handleSubmit(onSavePressed, onSaveError)}
            disabled={isSaving}>
            <Text style={styles.btnSaveText}>
              {isSaving ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                'Simpan'
              )}
            </Text>
          </TouchableOpacity>
        </FormProvider>

        <TouchableOpacity style={styles.btnLogout} onPress={logout}>
          <Text style={styles.btnLogoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
