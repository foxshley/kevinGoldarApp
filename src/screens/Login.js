/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';
import InputField from '../components/InputField';

// const auth = firebase.auth();

const styles = StyleSheet.create({
  logo: {
    backgroundColor: 'gray',
    width: 250,
    height: 100,
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: '100',
    color: '#535353',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#938484',
  },
  btnLogin: {
    width: 300,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnLoginText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  register: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30,
    textAlign: 'center',
  },
  btnRegister: {
    color: '#FF5858',
    marginLeft: 5,
  },
  loginError: {
    color: 'red',
    textAlign: 'center',
  },
});

const Logo = ({}) => <View style={styles.logo}></View>;

export default function Login({navigation}) {
  const [isLogginIn, setIsLogginIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onForgotPasswordPressed = () => {};

  const onRegisterPressed = () => {
    navigation.push('Register');
  };

  const onLoginPressed = () => {
    setIsLogginIn(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        setError(err.message);
        setIsLogginIn(false);
      });
  };

  return (
    <Container>
      <Logo />
      <Text style={styles.title}>Login</Text>
      <Text style={styles.description}>
        Silahkan masukkan email dan password anda
      </Text>
      <Text style={styles.loginError}>{error}</Text>
      <InputField
        placeholder="Email"
        autocompleteType="email"
        onChangeText={email => setEmail(email)}
      />
      <InputField
        placeholder="Password"
        autocompleteType="password"
        secureTextEntry={true}
        onChangeText={password => setPassword(password)}
      />
      <Pressable style={{marginLeft: 'auto'}} onPress={onForgotPasswordPressed}>
        <Text style={{color: '#FF5858'}}>Lupa Password?</Text>
      </Pressable>
      <TouchableOpacity style={styles.btnLogin} onPress={onLoginPressed}>
        <Text style={styles.btnLoginText}>
          {isLogginIn ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            'Login'
          )}
        </Text>
      </TouchableOpacity>
      <View style={styles.register}>
        <Text style={{color: '#535353'}}>Tidak punya akun?</Text>
        <Pressable onPress={onRegisterPressed}>
          <Text style={styles.btnRegister}>Daftar</Text>
        </Pressable>
      </View>
    </Container>
  );
}
