/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useContext} from 'react';
import {Text, StyleSheet, Button} from 'react-native';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';

const styles = StyleSheet.create({});

export default function Home() {
  const [name, setName] = useState('');

  const logout = () => {
    auth().signOut();
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
