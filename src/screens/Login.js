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
import {FormProvider, useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';

import Container from '../components/Container';
import FormInputField from '../components/FormInputField';

import AuthContext from '../contexts/AuthContext';

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
  },
});

const Logo = ({}) => <View style={styles.logo}></View>;

export default function Login({navigation}) {
  const [isLogginIn, setIsLogginIn] = useState(false);
  const [error, setError] = useState('');

  const formMethods = useForm();
  const {signIn} = useContext(AuthContext);

  const onForgotPasswordPressed = () => {};

  const onRegisterPressed = () => {
    navigation.push('Register');
  };

  const onLoginPressed = form => {
    setIsLogginIn(true);
    auth()
      .signInWithEmailAndPassword(form.Email, form.Password)
      .then(() => {
        signIn();
      })
      .catch(err => {
        setError(err.message);
        setIsLogginIn(false);
      });
  };

  const onLoginError = form => {
    // console.warn(form);
  };

  return (
    <Container>
      <Text style={styles.title}>Login</Text>
      <Text style={[styles.description, error && styles.loginError]}>
        {error ? error : 'Silahkan masukkan email dan password anda'}
      </Text>
      <Text style={styles.loginError}></Text>
      <FormProvider {...formMethods}>
        <FormInputField
          name="Email"
          placeholder="Email"
          autocompleteType="email"
          keyboardType="email-address"
          returnKeyType="next"
          returnKeyLabel="next"
          // onChangeText={email => setEmail(email)}
          rules={{
            required: 'Email wajib diisi!',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Email tidak valid!',
            },
          }}
        />
        <FormInputField
          name="Password"
          placeholder="Password"
          autocompleteType="password"
          returnKeyType="go"
          returnKeyLabel="go"
          secureTextEntry={true}
          // onChangeText={password => setPassword(password)}
          rules={{
            required: 'Password wajib diisi!',
            minLength: {
              message: 'Password terlalu pendek, minimal 6 karakter.',
              value: 6,
            },
          }}
        />
      </FormProvider>
      <Pressable
        style={{marginLeft: 'auto', marginBottom: 20}}
        onPress={onForgotPasswordPressed}>
        <Text style={{color: '#FF5858'}}>Lupa Password?</Text>
      </Pressable>
      <TouchableOpacity
        style={styles.btnLogin}
        onPress={formMethods.handleSubmit(onLoginPressed, onLoginError)}
        disabled={isLogginIn}>
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
