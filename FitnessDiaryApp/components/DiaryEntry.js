import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DiaryEntry = ({ entry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{entry.date}</Text>
      <Text style={styles.exercise}>{entry.exercise}</Text>
      <Text style={styles.effort}>Effort: {entry.effort}/10</Text>
      {entry.imageURL && (
        <Image
          source={{ uri: entry.imageURL }}
          style={styles.imagePreview}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default DiaryEntry;
