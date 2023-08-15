import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer, Gyroscope } from 'react-native-sensors';
import FuzzyLite from 'fuzzylite';

const App = () => {
  const [accelerationValue, setAccelerationValue] = useState(0);
  const [gyroscopeValue, setGyroscopeValue] = useState(0);
  const [accidentSeverity, setAccidentSeverity] = useState(null);

  useEffect(() => {
    const engine = new FuzzyLite.Engine();

    const acceleration = new FuzzyLite.InputVariable();
    acceleration.setName('acceleration');
    acceleration.setRange(0, 10);

    const gyroscope = new FuzzyLite.InputVariable();
    gyroscope.setName('gyroscope');
    gyroscope.setRange(0, 10);

    const accidentSeverity = new FuzzyLite.OutputVariable();
    accidentSeverity.setName('accidentSeverity');
    accidentSeverity.setRange(0, 10);

    // Define linguistic terms for input variables
    const low = new FuzzyLite.Triangle('low', 0, 2, 4);
    const medium = new FuzzyLite.Triangle('medium', 3, 5, 7);
    const high = new FuzzyLite.Triangle('high', 6, 8, 10);

    acceleration.addTerm(low);
    acceleration.addTerm(medium);
    acceleration.addTerm(high);

    gyroscope.addTerm(low);
    gyroscope.addTerm(medium);
    gyroscope.addTerm(high);

    // Define linguistic terms for output variable
    const minor = new FuzzyLite.Triangle('minor', 0, 2, 4);
    const moderate = new FuzzyLite.Triangle('moderate', 3, 5, 7);
    const severe = new FuzzyLite.Triangle('severe', 6, 8, 10);
    const verySevere = new FuzzyLite.Triangle('verySevere', 7, 9, 10);

    accidentSeverity.addTerm(minor);
    accidentSeverity.addTerm(moderate);
    accidentSeverity.addTerm(severe);
    accidentSeverity.addTerm(verySevere);

    // Define fuzzy rules
    const rule1 = new FuzzyLite.Rule('IF acceleration IS low AND gyroscope IS low THEN accidentSeverity IS minor');
    const rule2 = new FuzzyLite.Rule('IF acceleration IS medium AND gyroscope IS medium THEN accidentSeverity IS moderate');
    const rule3 = new FuzzyLite.Rule('IF acceleration IS high AND gyroscope IS high THEN accidentSeverity IS severe');
    const rule4 = new FuzzyLite.Rule('IF acceleration IS high AND gyroscope IS low THEN accidentSeverity IS verySevere');
    const rule5 = new FuzzyLite.Rule('IF acceleration IS low AND gyroscope IS high THEN accidentSeverity IS verySevere');

    engine.addInputVariable(acceleration);
    engine.addInputVariable(gyroscope);
    engine.addOutputVariable(accidentSeverity);

    engine.addRule(rule1);
    engine.addRule(rule2);
    engine.addRule(rule3);
    engine.addRule(rule4);
    engine.addRule(rule5);

    const accelerometerSubscription = new Accelerometer({
      updateInterval: 1000,
    }).subscribe(({ x, y, z }) => {
      const avgAcceleration = (x + y + z) / 3 * 10;
      setAccelerationValue(avgAcceleration);
      acceleration.setInputValue(avgAcceleration);
      engine.process();
      setAccidentSeverity(accidentSeverity.getOutputValue());
    });

    const gyroscopeSubscription = new Gyroscope({
      updateInterval: 1000,
    }).subscribe(({ x, y, z }) => {
      const avgGyroscope = (x + y + z) / 3 * 10;
      setGyroscopeValue(avgGyroscope);
      gyroscope.setInputValue(avgGyroscope);
      engine.process();
      setAccidentSeverity(accidentSeverity.getOutputValue());
    });

    return () => {
      accelerometerSubscription.unsubscribe();
      gyroscopeSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acceleration: {accelerationValue.toFixed(2)}</Text>
      <Text style={styles.text}>Gyroscope: {gyroscopeValue.toFixed(2)}</Text>
      <Text style={styles.text}>
        {accidentSeverity !== null
          ? `Accident Severity: ${accidentSeverity.toFixed(2)}`
          : 'Calculating...'}
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

export default App;
