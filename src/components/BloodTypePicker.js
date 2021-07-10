import React from 'react';
import {StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const styles = StyleSheet.create({
  input: {
    width: 300,
    marginHorizontal: 'auto',
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

const BloodTypePicker = ({isError, ...props}) => (
  <Picker
    {...props}
    style={[styles.input, isError && {borderColor: '#FF5858', borderWidth: 1}]}
    backgroundColor="#ECE6E6">
    <Picker.Item label="-- Pilih Golongan Darah --" value="" />
    <Picker.Item label="A+" value="A+" />
    <Picker.Item label="A-" value="A-" />
    <Picker.Item label="B+" value="B+" />
    <Picker.Item label="B-" value="B-" />
    <Picker.Item label="AB+" value="AB+" />
    <Picker.Item label="AB-" value="AB-" />
    <Picker.Item label="O+" value="O+" />
    <Picker.Item label="O-" value="O-" />
  </Picker>
);

export default BloodTypePicker;
