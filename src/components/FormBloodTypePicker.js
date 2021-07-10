import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useController, useFormContext} from 'react-hook-form';

import BloodTypePicker from './BloodTypePicker';

const styles = StyleSheet.create({
  errorMessage: {
    color: '#FF5858',
  },
});

export default function FormBloodTypePicker(props) {
  const {name, rules, defaultValue = '', ...inputProps} = props;

  const formContext = useFormContext();
  const {control, errors} = formContext;

  const {field} = useController({name, control, rules, defaultValue});

  const errMessage = errors[name]?.message;

  return (
    <View>
      <BloodTypePicker
        {...inputProps}
        isError={Boolean(errMessage)}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        selectedValue={field.value}
      />
      {Boolean(errors) && <Text style={styles.errorMessage}>{errMessage}</Text>}
    </View>
  );
}
