import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [subjects, setSubjects] = useState([]);

  const loadSubjects = async () => {
    const data = await AsyncStorage.getItem('subjects');
    if (data) setSubjects(JSON.parse(data));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadSubjects);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Button title="Add Subject" onPress={() => navigation.navigate('AddSubject')} />
      <Button title="Open Calendar" onPress={() => navigation.navigate('Calendar')} />
      {/* <Button
  title={`Open ${item.name} Calendar`}
  onPress={() => navigation.navigate('SubjectCalendar', { subjectId: item.id })}
/> */}

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subjectName}>{item.name}</Text>
            <Text>
              {item.attended}/{item.total}{' '}
              ({item.total > 0 ? Math.round((item.attended / item.total) * 100) : 0}%)
            </Text>
            <Button
              title={`Open ${item.name} Calendar`}
              onPress={() =>
                navigation.navigate('SubjectCalendar', { subjectId: item.id })
              }
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
