import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useController, useFormContext} from 'react-hook-form';

import InputField from './InputField';

const styles = StyleSheet.create({
  errorMessage: {
    color: '#FF5858',
  },
});

export default function FormInputField(props) {
  const {name, rules, defaultValue = '', ...inputProps} = props;

  const formContext = useFormContext();
  const {control, errors} = formContext;

  const {field} = useController({name, control, rules, defaultValue});

  const errMessage = errors[name]?.message;

  return (
    <View>
      <InputField
        {...inputProps}
        isError={Boolean(errMessage)}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
      />
      {Boolean(errors) && <Text style={styles.errorMessage}>{errMessage}</Text>}
    </View>
  );
}
