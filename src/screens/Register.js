/**
 * @format
 * @flow strict-local
 */

import React, { useState, useContext } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import Container from '../components/Container'
import InputField from '../components/InputField'
import BloodTypePicker from '../components/BloodTypePicker'

import AuthContext from '../contexts';

import { REGISTER_ENDPOINT } from '../constants'

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50
  },
  btnRegister: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858'
  },
  btnRegisterText: {
    color: '#eee',
    textAlign: 'center'
  },
});


export default function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [bloodType, setBloodType] = useState('');

  const { register } = useContext(AuthContext);

  const onRegisterPressed = () => {
    // axios.post(REGISTER_ENDPOINT, {
    //     nama: nama,  
    //     email: email,
    //     password: password,
    //     konfirmasiPassword: konfirmasiPassword,
    //     goldar: bloodType
    //   })
    //   .then((response) => {

    //   })
    //   .catch((error) => {
    //     console.log('Error!');
    //   });
    register();
  }
  
  return (
    <Container>
      <Text style={styles.heading}>Create New Account</Text>
      <InputField placeholder="Nama" onValueChange={(nama) => setNama(nama) }/>
      <InputField placeholder="Email"  onValueChange={(email) => setEmail(email) }/>
      <InputField placeholder="Password" onValueChange={(password) => setPassword(password)} />
      <InputField placeholder="Konfirmasi Password" onValueChange={(konfirmasiPassword) => setKonfirmasiPassword(konfirmasiPassword)}/>
      <BloodTypePicker selectedValue={bloodType} onValueChange={(itemVal, itemIdx) => setBloodType(itemVal)} />
      <TouchableOpacity style={styles.btnRegister} onPress={onRegisterPressed}>
        <Text style={styles.btnRegisterText}>Daftar</Text>
      </TouchableOpacity>
    </Container>
  );
};