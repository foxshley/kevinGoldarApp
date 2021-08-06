/**
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MapScreen from './Map';
import NavigationScreen from './Navigation';
import MessagesScreen from './Messages';
import MessagesChatScreen from './MessagesChat';
import ProfileScreen from './Profile';
import LogoutScreen from './Logout';

const HomeStack = createStackNavigator();
const TabStack = createBottomTabNavigator();

const styles = StyleSheet.create({});

const TabStackScreen = () => {
  const [unreadMessages, setUnreadMessages] = useState(false);

  const checkUnreadMessages = async () => {
    const uid = auth().currentUser.uid;
    let snapshotRef = null;

    try {
      snapshotRef = await firestore()
        .collection('lastMessages')
        .doc(uid)
        .collection('messages')
        .where('unread', '==', true)
        .onSnapshot(snapshot => {
          if (!snapshot.empty) setUnreadMessages(true);
          else setUnreadMessages(false);
        });
    } catch (err) {
      console.error(err);
    }

    return snapshotRef;
  };

  useEffect(() => {
    let unsubscribe = null;
    (async () => {
      unsubscribe = await checkUnreadMessages();
    })();

    return () => unsubscribe();
  }, []);

  return (
    <TabStack.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        showLabel: false,
      }}>
      <TabStack.Screen name="Home" component={MapScreen} />
      <TabStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={unreadMessages ? {tabBarBadge: ' '} : {tabBarBadge: null}}
      />
      <TabStack.Screen name="Profile" component={ProfileScreen} />
    </TabStack.Navigator>
  );
};

export default function Home() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      <HomeStack.Screen name="MainMenu" component={TabStackScreen} />
      <HomeStack.Screen name="Navigation" component={NavigationScreen} />
      <HomeStack.Screen
        name="MessagesChat"
        component={MessagesChatScreen}
        options={{headerShown: true}}
      />
      <HomeStack.Screen name="Logout" component={LogoutScreen} />
    </HomeStack.Navigator>
  );
}
