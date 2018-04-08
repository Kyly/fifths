import { combineReducers } from 'redux';
import keys from './keys';
import art from './art';

const AppReducer = combineReducers({
  keys,
  art,
});

export default AppReducer;
