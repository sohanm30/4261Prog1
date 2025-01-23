// screens/AddEntryScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../services/firebaseConfig';
import firebase from '../services/firebaseConfig'; // Add this line

const AddEntryScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [exercise, setExercise] = useState('');
  const [effort, setEffort] = useState('');

  const handleAddEntry = () => {
    if (date === '' || exercise === '' || effort === '') {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    // Simple validation for effort
    const effortValue = parseInt(effort);
    if (isNaN(effortValue) || effortValue < 1 || effortValue > 10) {
      Alert.alert('Error', 'Effort must be a number between 1 and 10');
      return;
    }

    // Validate date format (basic)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format');
      return;
    }

    // Add entry to Firestore
    firestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .collection('diary')
      .add({
        date,
        exercise,
        effort: effortValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Success', 'Entry added successfully');
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-01-20"
        value={date}
        onChangeText={setDate}
      />
      <Text style={styles.label}>Exercise:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Running"
        value={exercise}
        onChangeText={setExercise}
      />
      <Text style={styles.label}>Effort (1-10):</Text>
      <TextInput
        style={styles.input}
        placeholder="7"
        value={effort}
        onChangeText={setEffort}
        keyboardType="numeric"
      />
      <Button title="Add Entry" onPress={handleAddEntry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default AddEntryScreen;
