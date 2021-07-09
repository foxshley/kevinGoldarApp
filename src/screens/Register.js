/**
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Container from '../components/Container';
import InputField from '../components/InputField';
import BloodTypePicker from '../components/BloodTypePicker';

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  btnRegister: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnRegisterText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
});

export default function Register() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [error, setError] = useState('');

  const onRegisterPressed = () => {
    setIsRegistering(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(cred => {
        cred.user.updateProfile({
          displayName: nama,
        });

        firestore().collection('users').doc(cred.user.uid).set({
          bloodType: bloodType,
        });
      })
      .catch(error => {
        setError(error.message);
        setIsRegistering(false);
      });
  };

  return (
    <Container>
      <Text style={styles.heading}>Create New Account</Text>
      <InputField placeholder="Nama" onChangeText={nama => setNama(nama)} />
      <InputField placeholder="Email" onChangeText={email => setEmail(email)} />
      <InputField
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={password => setPassword(password)}
      />
      <InputField
        placeholder="Konfirmasi Password"
        secureTextEntry={true}
        onChangeText={konfirmasiPassword =>
          setKonfirmasiPassword(konfirmasiPassword)
        }
      />
      <BloodTypePicker
        selectedValue={bloodType}
        onValueChange={(itemVal, itemIdx) => setBloodType(itemVal)}
      />
      <TouchableOpacity style={styles.btnRegister} onPress={onRegisterPressed}>
        <Text style={styles.btnRegisterText}>
          {isRegistering ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            'Daftar'
          )}
        </Text>
      </TouchableOpacity>
    </Container>
  );
}
