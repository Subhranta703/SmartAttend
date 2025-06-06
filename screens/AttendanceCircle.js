import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

export default function AttendanceCircle({ percentage }) {
  const radius = 50;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Svg width="120" height="120">
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#ddd"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="green"
          strokeWidth={stroke}
          strokeDasharray={`${progress}, ${circumference}`}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={{ fontSize: 20, marginTop: 8 }}>{percentage}%</Text>
    </View>
  );
}
