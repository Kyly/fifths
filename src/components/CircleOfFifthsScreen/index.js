import React from 'react';
import { View, Text } from 'react-native';

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
          flexDirection: 'column',
          justifyContent: 'space-between',
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
            flex: .75,
          }}
        >
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: .1,
          }}
        >
          <View
            style={{
              flex: .25,
            }}
          >
          </View>
          <View
            style={{
              alignItems: 'center',
              flex: .75,
            }}
          >
            <Text>V</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
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
