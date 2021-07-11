/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Button, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import PersonImg from '../assets/person.png';

import Container from '../components/Container';

import AuthContext from '../contexts/AuthContext';

const styles = StyleSheet.create({
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default function Home() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);

  const {signOut} = useContext(AuthContext);

  const logout = () => {
    auth()
      .signOut()
      .then(() => signOut());
  };

  useEffect(() => {
    let displayName = auth().currentUser.displayName;
    let photo = auth().currentUser.photoURL;

    setName(displayName);
    if (photo) setPhoto(photo);
  }, []);

  return (
    <Container>
      <Text>Profile</Text>
      {photo ? (
        <Image source={{uri: photo}} style={styles.photo} />
      ) : (
        <Image source={PersonImg} style={styles.photo} />
      )}
      <Text>Halo {name}!</Text>
      <Button title="Logout" onPress={logout} />
    </Container>
  );
}
