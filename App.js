import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { DrawerNavigator } from 'react-navigation';
import CircleOfFifthsScreen from './src/components/CircleOfFifthsScreen';
import References from './src/components/References';
import Composition from './src/components/Composition';
import AppReducer from './src/reducers';

const store = createStore(AppReducer);
const Navigation = DrawerNavigator({
  Home: {
    screen: CircleOfFifthsScreen,
  },
  Composition: {
    screen: Composition,
  },
  References: {
    screen: References,
  },
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('fifths', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
