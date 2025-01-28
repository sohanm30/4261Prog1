// screens/AddEntryScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, Image } from 'react-native';
import { auth, firestore } from '../services/firebaseConfig';
import firebase from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker'; // Import image picker

const AddEntryScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [exercise, setExercise] = useState('');
  const [effort, setEffort] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    // Request permissions and open image picker
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need access to your gallery to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Store the selected image URI
    }
  };

  const handleUploadImage = async () => {
    if (!image) return null;

    try {
      setUploading(true);

      // Create a unique file name
      const fileName = `${auth.currentUser.uid}-${Date.now()}.jpg`;
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storageRef = storage.ref().child(`images/${fileName}`);
      await storageRef.put(blob);

      // Get the download URL
      const downloadURL = await storageRef.getDownloadURL();
      setUploading(false);

      return downloadURL;
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
      return null;
    }
  };

  const handleAddEntry = async () => {
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

    const imageURL = await handleUploadImage();

    // Add entry to Firestore
    firestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .collection('diary')
      .add({
        date,
        exercise,
        effort: effortValue,
        imageURL,
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
      <Button title="Pick Image" onPress={handlePickImage} />
      {image && (
        Platform.OS === 'web' ? (
          <img
            src={image}
            alt="Selected preview"
            style={styles.imagePreview}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={styles.imagePreview}
          />
        )
      )}
      <Button
        title={uploading ? 'Uploading...' : 'Add Entry'}
        onPress={handleAddEntry}
        disabled={uploading}
      />
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
  imagePreview: {
    width: '50%',
    height: '50%',
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ccc',
  },
});

export default AddEntryScreen;
