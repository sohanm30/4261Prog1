// navigation/StackNavigator.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from '../services/firebaseConfig';
import LoginScreen from '../screens/LoginScreen';
import DiaryScreen from '../screens/DiaryScreen';
import AddEntryScreen from '../screens/AddEntryScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; // Optionally, render a loading indicator here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen 
              name="Diary" 
              component={DiaryScreen} 
              options={{ title: 'Your Diary' }} 
            />
            <Stack.Screen 
              name="AddEntry" 
              component={AddEntryScreen} 
              options={{ title: 'Add New Entry' }} 
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ 
              headerShown: false, // Hide header for Login screen
              animationTypeForReplace: user ? 'push' : 'pop'
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
