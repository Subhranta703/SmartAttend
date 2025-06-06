import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

export default function SubjectCalendarScreen({ route }) {
  const { subjectId } = route.params;
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    loadSubject();
  }, []);

  const loadSubject = async () => {
    const data = await AsyncStorage.getItem('subjects');
    if (!data) return;

    const allSubjects = JSON.parse(data);
    const found = allSubjects.find((s) => s.id === subjectId);
    if (found) {
      setSubject(found);
    }
  };

  const toggleAttendance = async (date) => {
    const updatedAttendance = {
      ...subject.attendance,
      [date]: !subject.attendance?.[date],
    };

    const updatedSubject = { ...subject, attendance: updatedAttendance };

    // Update in storage
    const data = await AsyncStorage.getItem('subjects');
    const allSubjects = JSON.parse(data);
    const updatedSubjects = allSubjects.map((s) =>
      s.id === subjectId ? updatedSubject : s
    );

    await AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    setSubject(updatedSubject);
  };

  const getMarkedDates = () => {
    const marks = {};
    if (!subject?.attendance) return marks;

    Object.entries(subject.attendance).forEach(([date, attended]) => {
      marks[date] = {
        selected: true,
        selectedColor: attended ? 'green' : 'red',
      };
    });

    return marks;
  };

  const getSummary = () => {
    const entries = Object.values(subject?.attendance || {});
    const attended = entries.filter((a) => a === true).length;
    const total = entries.length;
    const percent = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { attended, total, percent };
  };

  if (!subject) return <Text>Loading...</Text>;

  const summary = getSummary();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subject.name}</Text>
      <Text style={styles.summary}>
        {summary.attended} / {summary.total} ({summary.percent}%)
      </Text>
      <Calendar
        onDayPress={(day) => toggleAttendance(day.dateString)}
        markedDates={getMarkedDates()}
      />
      {summary.percent < 75 && summary.total > 0 && (
        <Text style={styles.warning}>⚠️ Attendance is below 75%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  summary: { fontSize: 18, marginBottom: 10 },
  warning: { color: 'red', marginTop: 10, fontWeight: 'bold' },
});
