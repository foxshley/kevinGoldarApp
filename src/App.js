/**
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AuthScreen from './screens/Auth';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';

import AuthContext from './contexts';

function App () {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

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

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <SplashScreen />
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
