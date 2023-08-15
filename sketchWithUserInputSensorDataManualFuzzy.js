import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function App() {
  const [accelerationValue, setAccelerationValue] = useState('');
  const [gyroscopeValue, setGyroscopeValue] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState(null);

  const handleCalculateSeverity = () => {
    const acceleration = parseFloat(accelerationValue);
    const gyroscope = parseFloat(gyroscopeValue);

    // Membership functions and fuzzy logic calculations...
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


    // Update the accident severity state with the calculated value
    setAccidentSeverity(accidentSeverity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fuzzy Logic Accident Severity Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Acceleration Value"
        value={accelerationValue}
        onChangeText={text => setAccelerationValue(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Gyroscope Value"
        value={gyroscopeValue}
        onChangeText={text => setGyroscopeValue(text)}
        keyboardType="numeric"
      />
      <Button title="Calculate Severity" onPress={handleCalculateSeverity} />
      {accidentSeverity !== null && (
        <Text style={styles.result}>Accident Severity: {accidentSeverity.toFixed(2)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  result: {
    fontSize: 16,
    marginTop: 20,
  },
});
