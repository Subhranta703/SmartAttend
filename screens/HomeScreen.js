import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
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
    const percentage =
      totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    return { attendedDays, totalDays, percentage };
  };

  const deleteSubject = (id) => {
    Alert.alert('Delete Subject', 'Are you sure you want to delete this subject?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const filtered = subjects.filter((subj) => subj.id !== id);
            setSubjects(filtered);
            await AsyncStorage.setItem('subjects', JSON.stringify(filtered));
          } catch (error) {
            console.log('Failed to delete subject:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { attendedDays, totalDays, percentage } =
            getAttendanceSummary(item);

          return (
            <View style={styles.card}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.attendanceText}>
                {attendedDays} / {totalDays} days attended ({percentage}%)
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() =>
                    navigation.navigate('SubjectCalendar', {
                      subjectId: item.id,
                    })
                  }
                >
                  <Text style={styles.openButtonText}>📅 Open Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteSubject(item.id)}
                >
                  <Text style={styles.deleteButtonText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
              {percentage < 75 && totalDays > 0 && (
                <Text style={styles.warning}>⚠️ Attendance below 75%</Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noSubjects}>No subjects added yet.</Text>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              📱 Developed with ❤️ by Subhranta
            </Text>
            <Text style={styles.footerSubText}>
              Har Har Mahadev
            </Text>
          </View>
        }
      />

      {/* Floating Add Subject Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddSubject')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  openButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '600',
  },
  footerSubText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});
