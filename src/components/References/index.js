import React, { Component } from 'react';
import { View } from 'react-native';
import { default as Swiper } from 'react-native-swiper';

import CircleOfFifthsReference from './circle-of-fifths';

export default class References extends Component {
  render() {
    return (
      <Swiper >
        <CircleOfFifthsReference />
      </ Swiper>
    );
  }
};

