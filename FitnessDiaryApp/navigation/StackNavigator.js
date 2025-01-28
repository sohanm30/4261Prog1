import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { auth } from '../services/firebaseConfig';
import LoginScreen from '../screens/LoginScreen';
import DiaryScreen from '../screens/DiaryScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f7f7f7' },
          headerTitleStyle: { color: '#333' },
          headerTintColor: '#007aff',
        }}
      >
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
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
});

export default StackNavigator;
