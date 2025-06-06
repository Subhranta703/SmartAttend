import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AttendanceCircle from '../components/AttendanceCircle';

export default function SubjectCalendarScreen({ route, navigation }) {
  const { subjectId } = route.params;
  const [subject, setSubject] = useState(null);
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    loadSubject();
  }, []);

  const loadSubject = async () => {
    const subjects = JSON.parse(await AsyncStorage.getItem('subjects')) || [];
    const found = subjects.find((s) => s.id === subjectId);
    if (!found) {
      Alert.alert('Subject not found');
      navigation.goBack();
      return;
    }
    setSubject(found);
    setCalendarData(found.calendar || {});
  };

  const handleDayPress = async (day) => {
    const date = day.dateString;
    let updated = { ...calendarData };

    if (!updated[date]) {
      updated[date] = { marked: true, dotColor: 'green', status: 'attended' };
    } else if (updated[date].status === 'attended') {
      updated[date] = { marked: true, dotColor: 'red', status: 'missed' };
    } else {
      delete updated[date];
    }

    setCalendarData(updated);

    // Update AsyncStorage
    const all = JSON.parse(await AsyncStorage.getItem('subjects')) || [];
    const updatedSubjects = all.map((s) =>
      s.id === subjectId ? { ...s, calendar: updated } : s
    );
    await AsyncStorage.setItem('subjects', JSON.stringify(updatedSubjects));
  };

  const getStats = () => {
    let attended = 0,
      missed = 0;
    Object.values(calendarData).forEach((d) => {
      if (d.status === 'attended') attended++;
      else if (d.status === 'missed') missed++;
    });
    const total = attended + missed;
    const percentage = total ? ((attended / total) * 100).toFixed(1) : 0;
    return { attended, missed, total, percentage };
  };

  const stats = getStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subject?.name}</Text>
      <AttendanceCircle percentage={stats.percentage} />
      <Calendar
        markedDates={calendarData}
        onDayPress={handleDayPress}
        markingType="dot"
      />
      <Text style={styles.info}>
        ✅ Attended: {stats.attended} | ❌ Missed: {stats.missed}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 10 },
  info: { textAlign: 'center', marginTop: 10 },
});
