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
import {FormProvider, useForm} from 'react-hook-form';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Container from '../components/Container';
import InputField from '../components/InputField';
import FormInputField from '../components/FormInputField';
import BloodTypePicker from '../components/BloodTypePicker';
import FormBloodTypePicker from '../components/FormBloodTypePicker';

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
  registerError: {
    textAlign: 'center',
    color: '#FF5858',
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

  const formMethods = useForm();

  const onRegisterPressed = form => {
    setIsRegistering(true);
    auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(cred => {
        cred.user.updateProfile({
          displayName: form.name,
        });

        firestore().collection('users').doc(cred.user.uid).set({
          bloodType: form.bloodType,
        });
      })
      .catch(error => {
        setError(error.message);
        setIsRegistering(false);
      });
  };

  const onRegisterError = form => {};

  return (
    <Container>
      <FormProvider {...formMethods}>
        <Text style={styles.heading}>Create New Account</Text>
        <Text style={styles.registerError}>{error}</Text>
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
        <FormInputField
          name="password"
          placeholder="Password"
          autocompleteType="password"
          keyboardType="default"
          returnKeyType="next"
          returnKeyLabel="next"
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
        <FormInputField
          name="passwordConfirm"
          placeholder="Konfirmasi Password"
          autocompleteType="password"
          keyboardType="default"
          returnKeyType="next"
          returnKeyLabel="next"
          secureTextEntry={true}
          // onChangeText={konfirmasiPassword =>
          //   setKonfirmasiPassword(konfirmasiPassword)
          // }
          rules={{
            required: 'Konfirmasi Password wajib diisi!',
            minLength: {
              message: 'Password terlalu pendek, minimal 6 karakter.',
              value: 6,
            },
          }}
        />
        <FormBloodTypePicker
          name="bloodType"
          // selectedValue={bloodType}
          // onValueChange={(itemVal, itemIdx) => setBloodType(itemVal)}
          rules={{
            required: 'Golongan darah wajib dipilih!',
          }}
        />
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={formMethods.handleSubmit(
            onRegisterPressed,
            onRegisterError,
          )}>
          <Text style={styles.btnRegisterText}>
            {isRegistering ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              'Daftar'
            )}
          </Text>
        </TouchableOpacity>
      </FormProvider>
    </Container>
  );
}
