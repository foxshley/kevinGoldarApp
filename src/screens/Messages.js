/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import PersonImg from '../assets/person.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    paddingLeft: 20,
    borderBottomWidth: 2,
    borderColor: '#938484',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  messagesContainer: {
    padding: 15,
  },
  messageContainerEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageItem: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageBody: {
    width: 275,
    justifyContent: 'space-evenly',
    textAlign: 'left',
    borderBottomWidth: 0.5,
    borderColor: '#D3D3D3',
    paddingBottom: 15,
  },
  messageContentHeader: {
    flexDirection: 'row',
  },
  messageName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  messageDate: {
    fontSize: 14,
    lineHeight: 24,
    color: '#938484',
    marginLeft: 'auto',
    marginRight: 5,
  },
  messageColumn: {
    flex: 1,
    flexDirection: 'row',
  },
  messageContent: {
    fontSize: 16,
    color: '#938484',
  },
  sticker: {
    marginTop: 7,
    marginRight: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'tomato',
    marginLeft: 'auto',
  },
});

export default function Messages({navigation}) {
  const [lastMessages, setLastMessages] = useState([]);

  const fetchLastMessages = async () => {
    const uid = auth().currentUser.uid;
    let snapshotRef = null;

    snapshotRef = await firestore()
      .collection('lastMessages')
      .doc(uid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot.empty) {
          const data = [];
          snapshot.forEach(docSnapshot => {
            let message = docSnapshot.data();

            data.push({
              id: message.user.id,
              avatarUrl: message.user.avatar,
              name: message.user.name,
              lastMessage: message.text,
              createdAt: message.createdAt.toDate(),
              unread: message.unread,
              sent: message.sent,
            });
          });

          setLastMessages(data);
        }
      });

    return snapshotRef;
  };

  const onMessagePressed = id => {
    const uid = auth().currentUser.uid;

    firestore()
      .collection('lastMessages')
      .doc(uid)
      .collection('messages')
      .doc(id)
      .update({
        unread: false,
      });

    navigation.navigate('MessagesChat', {recipientId: id});
  };

  useLayoutEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await fetchLastMessages();
    })();

    return () => unsubscribe();
  }, []);

  const MessageItem = ({item}) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => onMessagePressed(item?.id)}>
      <Image
        style={styles.messageAvatar}
        source={item?.avatarUrl ? {uri: item?.avatarUrl} : PersonImg}
      />
      <View style={styles.messageBody}>
        <View style={styles.messageContentHeader}>
          <Text style={styles.messageName}>{item?.name}</Text>
          <Text
            style={[
              styles.messageDate,
              item?.unread ? {fontWeight: '700'} : {},
            ]}>
            {moment(item?.createdAt).isSame(new Date(), 'day')
              ? moment(item?.createdAt).format('HH:mm')
              : moment(item?.createdAt).format('DD/MM/YY')}
          </Text>
        </View>
        <View style={styles.messageColumn}>
          <Text
            style={[
              styles.messageContent,
              item?.unread ? {fontWeight: '700'} : {},
            ]}>
            {item?.lastMessage.length > 35
              ? item?.lastMessage.substring(0, 30) + '...'
              : item?.lastMessage}
          </Text>
          {item?.unread && <View style={styles.sticker}></View>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Messages</Text>
      </View>

      {lastMessages.length !== 0 ? (
        <View style={styles.messagesContainer}>
          <FlatList
            data={lastMessages}
            renderItem={MessageItem}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={styles.messageContainerEmpty}>
          <Text style={{color: '#A3A3A3'}}>
            There is no message in the inbox.
          </Text>
        </View>
      )}
    </View>
  );
}
