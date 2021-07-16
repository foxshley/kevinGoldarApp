import React, {useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'pinar';

import Container from '../components/Container';
import Slide from '../components/Slide';
import slides from '../slides';

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
});

export default function OnBoarding({navigation}) {
  const {setIsFirstTime} = useContext(AuthContext);

  const firstTimeCleanUp = async () => {
    await AsyncStorage.setItem('firstTime', 'check');
    setIsFirstTime(false);
  };

  const handleStart = async () => {
    await firstTimeCleanUp();
    navigation.reset({index: 1, routes: [{name: 'Login'}, {name: 'Register'}]});
  };

  const handleLogin = async () => {
    await firstTimeCleanUp();
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  return (
    <Container>
      <Carousel showsControls={false}>
        {slides.map(item => (
          <Slide
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </Carousel>
      <TouchableOpacity style={styles.btnStart} onPress={handleStart}>
        <Text style={styles.btnStartText}>Start</Text>
      </TouchableOpacity>
      <View style={styles.login}>
        <Text style={{color: '#535353'}}>Sudah punya akun?</Text>
        <Pressable onPress={handleLogin}>
          <Text style={styles.btnLogin}>Login</Text>
        </Pressable>
      </View>
    </Container>
  );
}
