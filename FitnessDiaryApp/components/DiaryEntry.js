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
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exercise: {
    fontSize: 14,
    marginTop: 5,
  },
  effort: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
  }
});

export default DiaryEntry;
