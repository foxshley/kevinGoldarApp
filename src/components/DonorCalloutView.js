import React, {useState, useEffect} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import storage from '@react-native-firebase/storage';

import PersonImg from '../assets/person.png';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingVertical: 15,
    width: 250,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
  },
  description: {
    marginTop: 25,
  },
  actionButtonsContainer: {
    // flex: 1
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#c3c3c3',
    marginTop: 20,
    padding: 10,
  },
  btn: {
    width: 100,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#FF5858',
  },
  btnText: {
    color: '#FCECEC',
    textAlign: 'center',
    fontWeight: '100',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  address: {
    fontStyle: 'italic',
  },
});

const Description = props => (
  <View style={styles.description}>
    <Text style={styles.name}>{props.donor.properties.name}</Text>
    <Text style={styles.address}>{props.donor.properties.address}</Text>
    <Text>Golongan Darah: {props.donor.properties.bloodType}</Text>
  </View>
);

const MessageButton = props => (
  <TouchableOpacity {...props} style={[styles.btn, {marginRight: 5}]}>
    <Text style={styles.btnText}>Message</Text>
  </TouchableOpacity>
);

const NavigateButton = props => (
  <TouchableOpacity {...props} style={styles.btn}>
    <Text style={styles.btnText}>Navigate</Text>
  </TouchableOpacity>
);

const ActionButtons = props => (
  <View style={styles.actionButtonsContainer}>
    <MessageButton onPress={props.onMessagePress} />
    <NavigateButton onPress={props.onNavigatePress} />
  </View>
);

export default function DonorCalloutView(props) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const url = await storage()
          .ref('avatar/' + props.donor.id)
          .getDownloadURL();

        setAvatarUrl(url);
      } catch (e) {
        // console.error(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image source={{uri: avatarUrl}} style={styles.avatar} />
      ) : (
        <Image source={PersonImg} style={styles.avatar} />
      )}
      <Description donor={props.donor} />
      <ActionButtons
        onMessagePress={props.onMessagePress}
        onNavigatePress={props.onNavigatePress}
      />
    </View>
  );
}
