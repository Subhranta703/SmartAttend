import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SubjectCard({ subject, setSubjects }) {
  const percentage = ((subject.attended / subject.total) * 100).toFixed(1);

  const updateAttendance = async (present) => {
    const data = await AsyncStorage.getItem('subjects');
    let subjects = JSON.parse(data);
    const index = subjects.findIndex((s) => s.id === subject.id);

    subjects[index].total += 1;
    if (present) subjects[index].attended += 1;

    await AsyncStorage.setItem('subjects', JSON.stringify(subjects));
    setSubjects(subjects);
  };

  return (
    <View style={[styles.card, percentage < 75 ? styles.low : styles.normal]}>
      <Text style={styles.title}>{subject.name}</Text>
      <Text>Attended: {subject.attended} / {subject.total}</Text>
      <Text>Attendance: {percentage}%</Text>
      <View style={styles.buttons}>
        <Button title="Present" onPress={() => updateAttendance(true)} />
        <Button title="Absent" onPress={() => updateAttendance(false)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  low: {
    backgroundColor: '#ffe0e0',
  },
  normal: {
    backgroundColor: '#e0ffe0',
  },
});
