import React, {useState, useCallback, useLayoutEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import PersonImg from '../assets/person.png';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginLeft: -20,
  },
  headerText: {
    marginLeft: 10,
    lineHeight: 38,
    color: '#FCECEC',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default function MessagesChat({route, navigation}) {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState(null);
  const [recipient, setRecipient] = useState(null);

  const getConversationId = (id1, id2) => {
    return id1 < id2 ? id1 + id2 : id2 + id1;
  };

  const fetchMessages = () => {
    let snapshotSubscription = null;
    (async () => {
      const id1 = auth().currentUser.uid;
      const id2 = route.params.recipientId;

      const conversationId = getConversationId(id1, id2);

      try {
        const personImgUrl = await storage()
          .ref('avatar/person.png')
          .getDownloadURL();
        snapshotSubscription = await firestore()
          .collection('chats')
          .doc(conversationId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .onSnapshot(snapshot =>
            setMessages(
              snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                text: doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
                user: {
                  _id: doc.data().user._id,
                  name: doc.data().user.name,
                  avatar: doc.data().user.avatar
                    ? doc.data().user.avatar
                    : personImgUrl,
                },
              })),
            ),
          );
      } catch (err) {
        console.error(err);
      }
    })();

    return snapshotSubscription;

    // const data = [
    //   {
    //     _id: 1,
    //     text: 'Hello',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'Sayed',
    //       avatar: 'https://i.pravatar.cc/100?img=3',
    //     },
    //   },
    // ];

    // setMessages(data);
  };

  const fetchSenderData = async () => {
    let id,
      name,
      avatarUrl = null;

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .get();

      id = auth().currentUser.uid;
      avatarUrl = auth().currentUser.photoURL;
      name = snapshot.data().name;
    } catch (err) {
      console.error(err);
    }

    return {
      id,
      avatarUrl,
      name,
    };
  };

  const fetchRecipientData = async () => {
    let id,
      name,
      avatarUrl = null;

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(route.params.recipientId)
        .get();

      id = route.params.recipientId;
      name = snapshot.data().name;
      avatarUrl = await storage()
        .ref('avatar/' + id)
        .getDownloadURL();
    } catch (err) {
      console.error(err);
    }

    return {
      id,
      avatarUrl,
      name,
    };
  };

  const onSend = (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    (async () => {
      const {_id, text, createdAt, user} = messages[0];
      const id1 = auth().currentUser.uid;
      const id2 = route.params.recipientId;
      const conversationId = getConversationId(id1, id2);

      try {
        await firestore()
          .collection('chats')
          .doc(conversationId)
          .collection('messages')
          .add({
            _id: _id,
            text: text,
            createdAt: createdAt,
            user: user,
          });

        await firestore()
          .collection('lastMessages')
          .doc(id1)
          .collection('messages')
          .doc(id2)
          .set({
            _id: _id,
            text: text,
            createdAt: createdAt,
            unread: false,
            user: {
              id: recipient.id,
              name: recipient.name,
              avatar: recipient.avatarUrl,
            },
          });

        await firestore()
          .collection('lastMessages')
          .doc(id2)
          .collection('messages')
          .doc(id1)
          .set({
            _id: _id,
            text: text,
            createdAt: createdAt,
            unread: true,
            user: {
              id: sender.id,
              name: sender.name,
              avatar: sender.avatarUrl,
            },
          });
      } catch (err) {
        console.error(err);
      }
    })();
  };

  useLayoutEffect(() => {
    (async () => {
      const senderData = await fetchSenderData();
      const recipientData = await fetchRecipientData();

      setSender(senderData);
      setRecipient(recipientData);
    })();

    const unsubscribe = fetchMessages();

    return () => {
      if (unsubscribe) return unsubscribe;
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerStyle: {
        backgroundColor: '#d13636',
      },
    });

    (async () => {
      let data = await fetchRecipientData();

      navigation.setOptions({
        headerTitle: props => (
          <View style={styles.headerContainer}>
            {data?.avatarUrl ? (
              <Image
                source={{uri: data?.avatarUrl}}
                style={styles.headerAvatar}
              />
            ) : (
              <Image source={PersonImg} style={styles.headerAvatar} />
            )}

            <Text style={styles.headerText}>{data?.name}</Text>
          </View>
        ),
        headerStyle: {
          backgroundColor: '#d13636',
        },
      });
    })();
  }, [navigation]);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth().currentUser.uid,
        name: auth().currentUser.displayName,
        avatar: auth().currentUser.photoURL,
      }}
    />
  );
}
