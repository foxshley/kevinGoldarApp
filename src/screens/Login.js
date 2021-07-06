/**
 * @format
 * @flow strict-local
 */

import React, { useState, useContext } from 'react';
import { View, Text, Pressable, StyleSheet, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';

import Container from '../components/Container'
import InputField from '../components/InputField'

import { LOGIN_ENDPOINT } from '../constants'
import AuthContext from '../contexts';

const styles = StyleSheet.create({
  logo: {
    backgroundColor: 'gray',
    width: 250,
    height: 100
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: '100',
    color: '#535353'
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#938484'
  },
  btnLogin: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858'
  },
  btnLoginText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100'
  },
  register: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
    textAlign: 'center'
  },
  btnRegister: { 
    color: '#FF5858', 
    marginLeft: 5
  }
})

const Logo = ({}) => (
  <View style={styles.logo}></View>
);

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AuthContext);

  const onForgotPasswordPressed = () => {

  }

  const onRegisterPressed = () => {
    navigation.push('Register');
  }

  const onLoginPressed = () => {
    // axios.post(LOGIN_ENDPOINT, {
    //     email: email,
    //     password: password
    //   })
    //   .then((response) => {

    //   })
    //   .catch((error) => {
    //     console.log('Error!');
    //   });
    login();
  }

  return (
    <Container>
      <Logo />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>Silahkan masukkan email dan password anda</Text>
      <InputField placeholder="Email" autocompleteType="email" onChange={(email) => setEmail(email)} />
      <InputField placeholder="Password" autocompleteType="password" secureTextEntry={true} onChange={(password) => setPassword(password)}/>
      <Pressable style={{ marginLeft: 'auto' }} onPress={onForgotPasswordPressed}>
        <Text style={{ color: '#FF5858' }}>Lupa Password?</Text>
      </Pressable>
      <TouchableOpacity style={styles.btnLogin} onPress={onLoginPressed}>
        <Text style={styles.btnLoginText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <Text style={{color: '#535353'}}>Tidak punya akun?</Text>
        <Pressable onPress={onRegisterPressed}>
          <Text style={styles.btnRegister}>Daftar</Text>
        </Pressable>
      </View>
    </Container>
  );
};