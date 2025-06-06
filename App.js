import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AddSubjectScreen from './screens/AddSubjectScreen';
import CalendarScreen from './screens/CalendarScreen';
import SubjectCalendarScreen from './screens/SubjectCalendarScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="SubjectCalendar" component={SubjectCalendarScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
