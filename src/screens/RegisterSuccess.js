import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import CheckImage from '../assets/check_illust.png';

import AuthContext from '../contexts/AuthContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStart: {
    width: 300,
    marginTop: 40,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnStartText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  login: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    textAlign: 'center',
  },
  btnLogin: {
    color: '#FF5858',
    marginLeft: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 50,
    // backgroundColor: '#FF5858',
  },
  image: {
    flex: 0.6,
  },
  content: {
    flex: 0.3,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
});

export default function RegisterSuccess({navigation}) {
  const {signIn} = useContext(AuthContext);

  const handleStart = async () => {
    signIn();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pendaftaran Selesai</Text>
      <Text>Selama menggunakan aplikasi!</Text>
      <Image
        source={CheckImage}
        style={[styles.image, {width: 200, resizeMode: 'contain'}]}
      />
      <View style={styles.content}>
        <TouchableOpacity style={styles.btnStart} onPress={handleStart}>
          <Text style={styles.btnStartText}>Mulai</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
