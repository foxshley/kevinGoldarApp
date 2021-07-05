import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from './Login';
import RegisterScreen from './Register';

const AuthStack = createStackNavigator();

export default function Auth() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}