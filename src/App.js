/**
 * @format
 * @flow strict-local
 */

// @refresh reset
import React, {useState, useEffect, useReducer, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import auth from '@react-native-firebase/auth';

import AuthContext from './contexts/AuthContext';

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
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignedIn: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignedIn: false,
          };
        case 'TOGGLE_LOADING':
          return {
            ...prevState,
            isLoading: !prevState.isLoading,
          };
      }
    },
    {
      isLoading: true,
      isSignedIn: false,
    },
  );

  const authContext = useMemo(
    () => ({
      signIn: () => dispatch({type: 'SIGN_IN'}),
      signOut: () => dispatch({type: 'SIGN_OUT'}),
    }),
    [],
  );

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

    if (auth().currentUser) {
      dispatch({type: 'SIGN_IN'});
    }

    dispatch({type: 'TOGGLE_LOADING'});

    // const subscriber = auth().onAuthStateChanged(user => {
    //   if (user) {
    //     setUser(user);
    //     if (isLoading) setIsLoading(false);
    //   } else {
    //     setUser(null);
    //     if (isLoading) setIsLoading(false);
    //   }
    // });

    // return subscriber;
  }, []);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  if (!permissionGranted) {
    return <PermissionError />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isSignedIn ? <HomeScreen /> : <AuthScreen />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
