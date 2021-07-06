import React from 'react';
import { TextInput, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  input: {
    width: 300,
    marginHorizontal: 'auto',
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ECE6E6'
  }
});

const InputField = (props) => (
    <TextInput {...props} style={styles.input} placeholderTextColor="#535353" />
);

export default InputField;