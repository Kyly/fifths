import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

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

