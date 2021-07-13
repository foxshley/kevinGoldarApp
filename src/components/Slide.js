import React from 'react';
import {View, Text, Image, StyleSheet, useWindowDimensions} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  image: {
    flex: 0.7,
  },
  content: {
    flex: 0.3,
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: '#493d8a',
    textAlign: 'center',
  },
  description: {
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 64,
  },
});

export default Slide = props => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={props.image}
        style={[styles.image, {width: 300, resizeMode: 'contain'}]}
      />
      <View style={[styles.content, {width}]}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
      </View>
    </View>
  );
};
