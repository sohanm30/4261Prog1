// screens/DiaryScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, firestore } from '../services/firebaseConfig';
import DiaryEntry from '../components/DiaryEntry';

const DiaryScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .collection('diary')
      .orderBy('date', 'desc')
      .onSnapshot(snapshot => {
        const fetchedEntries = [];
        snapshot.forEach(doc => {
          fetchedEntries.push({ id: doc.id, ...doc.data() });
        });
        setEntries(fetchedEntries);
        setLoading(false);
      }, error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleAddEntry = () => {
    navigation.navigate('AddEntry');
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert('Logout Error', error.message);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Add Entry" onPress={handleAddEntry} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
      {entries.length === 0 ? (
        <Text style={styles.noEntries}>No entries found. Add a new entry!</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <DiaryEntry entry={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEntries: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
});

export default DiaryScreen;
