/**
 * @format
 * @flow strict-local
 */

import React, {useState, useContext} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Carousel from 'pinar';

import Container from '../components/Container';
import Slide from '../components/Slide';

import SearchImg from '../assets/blood-search.png';
import DonorImg from '../assets/blood-transfusion.png';

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 50,
  },
  btnChoose: {
    width: 300,
    marginTop: 'auto',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnChooseText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  error: {
    textAlign: 'center',
    color: '#FF5858',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 'auto',
  },
});

export default function UploadAvatar({navigation}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState('');

  const onHandleChoose = () => {
    if (selectedIndex == 0) {
      navigation.push('UploadAvatar');
    } else if (selectedIndex == 1) {
      navigation.push('AddressRegister', {donorRole: true});
    }
  };

  const onHandleIndexChanged = ({index, total}) => {
    setSelectedIndex(index);
  };

  return (
    <Container>
      <Text style={styles.heading}>Choose Your Path</Text>
      <Text style={{textAlign: 'center'}}>Silahkan pilih jenis akun anda</Text>
      <Text style={styles.error}>{error}</Text>

      <Carousel showsControls={false} onIndexChanged={onHandleIndexChanged}>
        <Slide
          title="Pencari Donor"
          description="Anda dapat mencari dan menghubungi donor darah."
          image={SearchImg}
        />
        <Slide
          title="Pendonor"
          description="Anda dapat menawarkan diri untuk menjadi donor darah."
          image={DonorImg}
        />
      </Carousel>

      <TouchableOpacity style={styles.btnChoose} onPress={onHandleChoose}>
        <Text style={styles.btnChooseText}>Pilih</Text>
      </TouchableOpacity>
    </Container>
  );
}
