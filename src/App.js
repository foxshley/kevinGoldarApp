/**
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import AuthScreen from './screens/Auth';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';

import AuthContext from './contexts';

const styles = StyleSheet.create({
  permissionError: {
    flex: 1,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  }
});

const PermissionError = () => (
  <View style={styles.permissionError}>
    <Text>Please restart the application and allow the app to use location service.</Text>
  </View>
);

function App () {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(true);

  const authContext = useMemo(() => {
    return {
      login: () => {
        setIsLoading(false);
        setUserToken('asdkfjf');
      },
      logout: () => {
        setIsLoading(false);
        setUserToken(null);
      },
      register: () => {
        setIsLoading(false);
        setUserToken('aslkdfjskfj');
      },
    }
  }, []);

  const checkPermission = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then((result) => {
        if ((result === RESULTS.DENIED) || (result === RESULTS.BLOCKED)) {
          request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then((result) => {
              if ((result === RESULTS.DENIED) || (result === RESULTS.BLOCKED)) {
                setPermissionGranted(false);
              }
              else {
                setPermissionGranted(true);
              }
            });
        }
        else {
          setPermissionGranted(true);
        }
      });
  };

  useEffect(() => {
    setTimeout(() => {
      checkPermission();
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <SplashScreen />
  }

  if (!permissionGranted) {
    return <PermissionError />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken ? (
          <HomeScreen />
        ) : (
          <AuthScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
