import { createSelector } from 'reselect';
import { majorQualities, minorQualities, tonalGravity } from '../static/keySignatures';

// gets the 12 intervals of five related to the current key
export const fifths = createSelector(
  state => state.keys.currentKey,
  (key) => {
    const index = tonalGravity.findIndex(el => el.note === key);
    if ((index - 6 < 0) || (index + 5 > 28)) {
      return new Array(12).fill('');
    }
    const notes = tonalGravity.filter((el, i) => {
      if(i >= index - 6 && i <= index + 5) {
        return el;
      } else {
        return null;
      }
    }).map(el => el.note);
    return notes;
  },
);

// returns the correct rotation angle to put the new root to the top
export const rotation = createSelector(
  state => state.keys.currentKey,
  state => fifths(state),
  (currentKey, fifthNotes) => {
    const multiplier = fifthNotes.length - 1 - fifthNotes.findIndex(el => el === currentKey);
    const angle = (multiplier * 30) + 15;
    return angle;
  },
);
