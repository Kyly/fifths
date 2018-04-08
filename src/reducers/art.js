import { SET_CENTROIDS } from '../actions/art';

// if rotating, don't lock circle
// set rotating on start of panRespond
const reducer = (state = { centroids: [], rotating: false }, action) => {
  switch (action.type) {
    case SET_CENTROIDS: {
      return Object.assign({}, state, { centroids: action.centroids });
    }
    default:
      return state;
  }
};

export default reducer;
