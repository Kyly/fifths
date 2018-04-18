import { KEY_CHANGE, SCALE_CHANGE, TOGGLE_PARALLEL, TOGGLE_RELATIVE } from '../actions/keys';

const reducer = (state = {
  currentKey: 'C',
  scale: 'maj',
  showParallel: false,
  showRelative: false,
}, action) => {
  switch (action.type) {
    case KEY_CHANGE: {
      console.log('KEY CHANGE', action.newKey);
      return Object.assign({}, state, { currentKey: action.newKey });
    }
    case SCALE_CHANGE: {
      return Object.assign({}, state, { scale: action.scale });
    }
    case TOGGLE_PARALLEL: {
      return Object.assign({}, state, { showParallel: action.shouldShow });
    }
    case TOGGLE_RELATIVE: {
      return Object.assign({}, state, { showRelative: action.shouldShow });
    }
    default:
      return state;
  }
};

export default reducer;
