/**
 * @format
 * @flow strict-local
 */

// @refresh reset
import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import auth from '@react-native-firebase/auth';

import AuthScreen from './screens/Auth';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';

const styles = StyleSheet.create({
  permissionError: {
    flex: 1,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

const PermissionError = () => (
  <View style={styles.permissionError}>
    <Text>
      Please restart the application and allow the app to use location service.
    </Text>
  </View>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(true);

  const checkPermission = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
            setPermissionGranted(false);
          } else {
            setPermissionGranted(true);
          }
        });
      } else {
        setPermissionGranted(true);
      }
    });
  };

  useEffect(() => {
    checkPermission();

    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        if (isLoading) setIsLoading(false);
      } else {
        setUser(null);
        if (isLoading) setIsLoading(false);
      }
    });

    return subscriber;
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!permissionGranted) {
    return <PermissionError />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeScreen /> : <AuthScreen />}
    </NavigationContainer>
  );
}

export default App;
