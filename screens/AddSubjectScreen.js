import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddSubjectScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Subject name is required!');
      return;
    }

    const newSubject = {
      id: Date.now().toString(), // ✅ simpler ID method
      name: name.trim(),
      attendance: {}, // For storing attendance by date later
    };

    try {
      const existing = await AsyncStorage.getItem('subjects');
      const subjects = existing ? JSON.parse(existing) : [];
      subjects.push(newSubject);
      await AsyncStorage.setItem('subjects', JSON.stringify(subjects));

      const check = await AsyncStorage.getItem('subjects');
      console.log('✅ After Save:', check);

      navigation.goBack();
    } catch (error) {
      console.error('❌ Save error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Subject Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Chemistry"
        value={name}
        onChangeText={setName}
      />
      <Button title="Save Subject" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
  },
});
