import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './Login';
import RegisterScreen from './Register';
import RoleChooseScreen from './RoleChoose';
import AddressRegisterScreen from './AddressRegister';
import UploadAvatarScreen from './UploadAvatar';
import RegisterSuccessScreen from './RegisterSuccess';
import OnboardingScreen from './Onboarding';

import AuthContext from '../contexts/AuthContext';

const AuthStack = createStackNavigator();

export default function Auth() {
  const {isFirstTime} = useContext(AuthContext);

  return (
    <AuthStack.Navigator
      initialRouteName={isFirstTime ? 'Onboarding' : 'Login'}
      screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="RoleChoose" component={RoleChooseScreen} />
      <AuthStack.Screen
        name="AddressRegister"
        component={AddressRegisterScreen}
      />
      <AuthStack.Screen name="UploadAvatar" component={UploadAvatarScreen} />
      <AuthStack.Screen
        name="RegisterSuccess"
        component={RegisterSuccessScreen}
      />
    </AuthStack.Navigator>
  );
}
