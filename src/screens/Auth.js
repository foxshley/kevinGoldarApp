import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './Login';
import RegisterScreen from './Register';
import UploadAvatarScreen from './UploadAvatar';

const AuthStack = createStackNavigator();

export default function Auth() {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="UploadAvatar" component={UploadAvatarScreen} />
    </AuthStack.Navigator>
  );
}
