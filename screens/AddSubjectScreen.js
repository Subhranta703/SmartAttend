import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddSubjectScreen({ navigation }) {
  const [name, setName] = useState('');
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');

  const handleSave = async () => {
    if (!name || !attended || !total) {
      Alert.alert('All fields are required');
      return;
    }

    const newSubject = {
      id: uuidv4(),
      name,
      attended: parseInt(attended),
      total: parseInt(total),
    };

    const existing = await AsyncStorage.getItem('subjects');
    const subjects = existing ? JSON.parse(existing) : [];
    subjects.push(newSubject);
    await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text>Subject Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text>Attended:</Text>
      <TextInput style={styles.input} value={attended} onChangeText={setAttended} keyboardType="numeric" />
      <Text>Total:</Text>
      <TextInput style={styles.input} value={total} onChangeText={setTotal} keyboardType="numeric" />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 8,
    borderRadius: 6,
  },
});
