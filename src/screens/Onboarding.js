import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import Carousel from 'pinar';

import Container from '../components/Container';
import Slide from '../components/Slide';
import slides from '../slides';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function OnBoarding() {
  return (
    <Container>
      <Carousel showsControls={false}>
        {slides.map(item => (
          <Slide
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </Carousel>
    </Container>
  );
}
