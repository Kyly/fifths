import React from 'react';
import { View } from 'react-native';

import CofContainer from './CofContainer';
import Sidebar from './Sidebar';
import Toggles from './Toggles';
import ChordSelection from './ChordSelection';

const CircleOfFifthsScreen = () => (
  <View
    style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
      }}
    >
      <View
        style={{
          flex: 4,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Toggles />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <ChordSelection />
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Sidebar />
      </View>
    </View>
    <View
      style={{
        flex: 1,
      }}
    >
      <CofContainer />
    </View>
  </View>
);

export default CircleOfFifthsScreen;
