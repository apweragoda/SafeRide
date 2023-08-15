import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios'; // Import the axios library

const App = () => {
  const [severity, setSeverity] = useState(null);

  const handleCalculateSeverity = async () => {
    try {
      const response = await axios.post('http://localhost:5000/calculate-severity', {
        acceleration: 5, // Example accelerometer value
        gyroscope: 7,    // Example gyroscope value
      });

      setSeverity(response.data.severity);
    } catch (error) {
      console.error('Error calculating severity:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fuzzy Logic Accident Severity Calculator</Text>
      <Button
        style={styles.button}
        onPress={handleCalculateSeverity}
        underlayColor="#ccc"
      />
        <Text style={styles.buttonText}>Calculate Severity</Text>
      {severity !== null && (
        <Text style={styles.result}>Accident Severity: {severity.toFixed(2)}</Text>
      )}
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
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default App;
