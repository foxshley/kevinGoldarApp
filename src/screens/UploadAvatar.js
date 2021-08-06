/**
 * @format
 * @flow strict-local
 */

import React, {useState, useContext} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

import PersonImg from '../assets/person.png';
import Container from '../components/Container';

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  btnUpload: {
    width: 300,
    marginTop: 'auto',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnSkip: {
    width: 300,
    marginTop: 5,
    padding: 15,
  },
  btnUploadText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  btnSkipText: {
    color: '#535353',
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
  const [isUploading, setIsUploading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');

  const checkStoragePermission = async () => {
    let permissionGranted = false;

    await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
            permissionGranted = false;
          } else {
            permissionGranted = true;
          }
        });
      } else {
        permissionGranted = true;
      }
    });

    return permissionGranted;
  };

  const setDefaultAvatar = async () => {
    try {
      const url = await storage().ref('avatar/person.png').getDownloadURL();

      await auth().currentUser.updateProfile({
        photoURL: url,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onHandleChoosePhoto = async () => {
    if (checkStoragePermission()) {
      launchImageLibrary(
        {mediaType: 'photo', maxWidth: 1000, maxHeight: 1000},
        async response => {
          if (!response.didCancel) {
            setIsUploading(true);
            const uid = auth().currentUser.uid;
            const uploadUri = response.assets[0].uri;
            const photoRef = storage().ref('avatar/' + uid);

            setPhoto(uploadUri);
            await photoRef.putFile(uploadUri);

            const url = await storage()
              .ref('avatar/' + uid)
              .getDownloadURL();

            auth()
              .currentUser.updateProfile({
                photoURL: url,
              })
              .then(() => {
                setIsUploading(false);
                navigation.push('RegisterSuccess');
              })
              .catch(err => {
                setError(err.message);
              });
          }
        },
      );
    }
  };

  const onHandleSkip = () => {
    setDefaultAvatar();
    navigation.push('RegisterSuccess');
  };

  return (
    <Container>
      <Text style={styles.heading}>Upload Foto Anda</Text>
      <Text style={styles.error}>{error}</Text>

      {photo ? (
        <Image style={styles.photo} source={{uri: photo}} />
      ) : (
        <Image style={styles.photo} source={PersonImg} />
      )}

      <TouchableOpacity style={styles.btnUpload} onPress={onHandleChoosePhoto}>
        <Text style={styles.btnUploadText}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            'Upload foto anda'
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnSkip} onPress={onHandleSkip}>
        <Text style={styles.btnSkipText}>Skip</Text>
      </TouchableOpacity>
    </Container>
  );
}
