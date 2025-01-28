import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { auth, firestore } from '../services/firebaseConfig';

const DiaryScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch diary entries from Firestore
  useEffect(() => {
    const unsubscribe = firestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .collection('diary')
      .orderBy('date', 'desc')
      .onSnapshot(
        snapshot => {
          const fetchedEntries = [];
          snapshot.forEach(doc => {
            fetchedEntries.push({ id: doc.id, ...doc.data() });
          });
          setEntries(fetchedEntries);
          setLoading(false);
        },
        error => {
          Alert.alert('Error', error.message);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().catch(error => {
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
        <Button title="Add Entry" onPress={() => navigation.navigate('AddEntry')} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
      {entries.length === 0 ? (
        <Text style={styles.noEntries}>No entries found. Add a new entry!</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.exercise}>{item.exercise}</Text>
              <Text style={styles.effort}>Effort: {item.effort}</Text>
              {item.imageURL && (
                <Image
                  source={{ uri: item.imageURL }}
                  style={styles.imagePreview}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
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
    color: '#777',
  },
  entryContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  exercise: {
    fontSize: 16,
    marginTop: 5,
    color: '#555',
  },
  effort: {
    fontSize: 14,
    marginTop: 5,
    color: '#777',
  },
  imagePreview: {
    width: Platform.OS === 'web' ? '25%' : '100%',
    maxWidth: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default DiaryScreen;
