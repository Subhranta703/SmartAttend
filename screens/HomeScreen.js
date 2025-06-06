import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);

  const loadSubjects = async () => {
    try {
      const data = await AsyncStorage.getItem('subjects');
      if (data) {
        setSubjects(JSON.parse(data));
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.log('Failed to load subjects:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSubjects);
    return unsubscribe;
  }, [navigation]);

  const getAttendanceSummary = (subject) => {
    const attendanceData = subject.attendance || {};
    const totalDays = Object.keys(attendanceData).length;
    const attendedDays = Object.values(attendanceData).filter(Boolean).length;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    return { attendedDays, totalDays, percentage };
  };

  const deleteSubject = (id) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const filtered = subjects.filter((subj) => subj.id !== id);
              setSubjects(filtered);
              await AsyncStorage.setItem('subjects', JSON.stringify(filtered));
            } catch (error) {
              console.log('Failed to delete subject:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Add Subject" onPress={() => navigation.navigate('AddSubject')} />

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { attendedDays, totalDays, percentage } = getAttendanceSummary(item);

          return (
            <View style={styles.card}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.attendanceText}>
                {attendedDays} / {totalDays} days attended ({percentage}%)
              </Text>
              <Button
                title={`Open ${item.name} Calendar`}
                onPress={() => navigation.navigate('SubjectCalendar', { subjectId: item.id })}
              />
              {percentage < 75 && totalDays > 0 && (
                <Text style={styles.warning}>⚠️ Attendance below 75%</Text>
              )}
              <View style={{ marginTop: 8 }}>
                <Button
                  title="Delete Subject"
                  color="red"
                  onPress={() => deleteSubject(item.id)}
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.noSubjects}>No subjects added yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  attendanceText: {
    fontSize: 16,
    marginBottom: 8,
  },
  warning: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 4,
  },
  noSubjects: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});
