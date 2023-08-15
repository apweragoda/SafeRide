import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {

  const [accelerationValue] = useState(5); // Example dummy value
  const [gyroscopeValue] = useState(7); // Example dummy value

  
  // Membership functions for linguistic terms
  const membershipLow = value => Math.max(0, 1 - (Math.abs(value - 5) / 5));
  const membershipMedium = value => Math.max(0, 1 - (Math.abs(value - 5) / 2));
  const membershipHigh = value => Math.max(0, (Math.abs(value - 5) / 5));

  // Define fuzzy rules
  const rules = [
    { acceleration: 'low', gyroscope: 'low', severity: 'minor' },
    { acceleration: 'medium', gyroscope: 'medium', severity: 'moderate' },
    { acceleration: 'high', gyroscope: 'high', severity: 'severe' },
    { acceleration: 'high', gyroscope: 'low', severity: 'verySevere' },
    { acceleration: 'low', gyroscope: 'high', severity: 'verySevere' },
    // Add more rules for accuracy
  ];

  // Calculate fuzzy inference
  const inference = rules.map(rule => {
    let accelerationMembership = membershipLow(accelerationValue);
    let gyroscopeMembership = membershipLow(gyroscopeValue);

    if (rule.acceleration === 'medium') {
      accelerationMembership = membershipMedium(accelerationValue);
    } else if (rule.acceleration === 'high') {
      accelerationMembership = membershipHigh(accelerationValue);
    }

    if (rule.gyroscope === 'medium') {
      gyroscopeMembership = membershipMedium(gyroscopeValue);
    } else if (rule.gyroscope === 'high') {
      gyroscopeMembership = membershipHigh(gyroscopeValue);
    }

    const minMembership = Math.min(accelerationMembership, gyroscopeMembership);
    return { severity: rule.severity, membership: minMembership };
  });
  
  // Helper function to assign weights to severity levels
  const getSeverityValue = severity => {
    switch (severity) {
      case 'minor':
        return 4;
      case 'moderate':
        return 7;
      case 'severe':
        return 10;
      case 'verySevere':
        return 12; // You can adjust this weight as needed
      default:
        return 0;
    }
  };

  // Defuzzify to calculate final accident severity
  const totalWeight = inference.reduce((sum, rule) => sum + rule.membership, 0);
  const weightedSum = inference.reduce((sum, rule) => sum + (rule.membership * getSeverityValue(rule.severity)), 0);
  const accidentSeverity = weightedSum / totalWeight;



  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acceleration: {accelerationValue.toFixed(2)}</Text>
      <Text style={styles.text}>Gyroscope: {gyroscopeValue.toFixed(2)}</Text>
      <Text style={styles.text}>
        Accident Severity: {accidentSeverity.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});