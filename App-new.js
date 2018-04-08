import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import CircleOfFifthsScreen from './src/CircleOfFifthsScreen';
import AppReducer from './reducers';

const store = createStore(AppReducer);

const App = () => (
  <Provider store={store}>
    <View>
      <CircleOfFifthsScreen />
    </View>
  </Provider>
);

export default App;
