import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  input: {
    width: 300,
    marginHorizontal: 'auto',
    // marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ECE6E6',
  },
});

const InputField = ({isError, ...props}) => (
  <TextInput
    {...props}
    style={[styles.input, isError && {borderColor: '#FF5858', borderWidth: 1}]}
    placeholderTextColor="#535353"
  />
);

export default InputField;
