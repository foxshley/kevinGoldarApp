/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';

import AuthContext from '../contexts/AuthContext';

const styles = StyleSheet.create({});

export default function Home() {
  const [name, setName] = useState('');

  const {signOut} = useContext(AuthContext);

  const logout = () => {
    auth()
      .signOut()
      .then(() => signOut());
  };

  useEffect(() => {
    let displayName = auth().currentUser.displayName;
    setName(displayName);
  }, []);

  return (
    <Container>
      <Text>Profile</Text>
      <Text>Halo {name}!</Text>
      <Button title="Logout" onPress={logout} />
    </Container>
  );
}
