import React from 'react';
import { TextInput, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  input: {
    width: 300,
    marginHorizontal: 'auto',
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#aaa'
  }
});

const InputField = (props) => (
    <TextInput {...props} style={styles.input} placeholderTextColor="#eee" />
);

export default InputField;