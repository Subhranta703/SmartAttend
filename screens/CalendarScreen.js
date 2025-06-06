import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await AsyncStorage.getItem('markedDates');
      if (data) setMarkedDates(JSON.parse(data));
    };
    fetchData();
  }, []);

  const handleDayPress = async (day) => {
    const date = day.dateString;
    let updated = { ...markedDates };

    if (!updated[date]) {
      updated[date] = { marked: true, dotColor: 'green', status: 'attended' };
    } else if (updated[date].status === 'attended') {
      updated[date] = { marked: true, dotColor: 'red', status: 'missed' };
    } else {
      delete updated[date];
    }

    setMarkedDates(updated);
    await AsyncStorage.setItem('markedDates', JSON.stringify(updated));
  };

  const calculateStats = () => {
    let attended = 0;
    let missed = 0;

    Object.values(markedDates).forEach((entry) => {
      if (entry.status === 'attended') attended++;
      else if (entry.status === 'missed') missed++;
    });

    const total = attended + missed;
    const percentage = total ? ((attended / total) * 100).toFixed(2) : 0;

    return { attended, missed, total, percentage };
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tap a day to toggle: ✅ → ❌ → 🗑️</Text>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} markingType="dot" />
      <View style={styles.statsBox}>
        <Text>✅ Attended: {stats.attended}</Text>
        <Text>❌ Missed: {stats.missed}</Text>
        <Text>📚 Total: {stats.total}</Text>
        <Text>📊 Attendance %: {stats.percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16 },
  header: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  statsBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
});
