import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { auth, firestore } from '../services/firebaseConfig';
import DiaryEntry from '../components/DiaryEntry'; // Assuming DiaryEntry will handle individual entries

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
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.exercise}>{item.exercise}</Text>
              <Text style={styles.effort}>Effort: {item.effort}</Text>

              {/* Display image if available */}
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
  entryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exercise: {
    fontSize: 16,
    marginTop: 5,
  },
  effort: {
    fontSize: 14,
    marginTop: 5,
    color: '#777',
  },
  imagePreview: {
    maxWidth: 300,
    maxHeight: 300,
    width: '50%',
    aspectRatio: 1,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default DiaryScreen;
