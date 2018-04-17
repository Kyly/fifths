import { createSelector } from 'reselect';
import { majorQualities, minorQualities, tonalGravity } from '../static/keySignatures';

/*
** key array
** [ { quality: '', parallel: '', relative: '', } ]
*/

export const fifths = createSelector(
  state => state.keys.currentKey,
  (key) => {
    // TODO handle mapping double flats and sharps
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
    console.log(notes);
    console.log('key', key);
    return notes;
  },
);

export const rotation = createSelector(
  state => state.keys.currentKey,
  state => fifths(state),
  (currentKey, fifthNotes) => {
    const multiplier = fifthNotes.length - 1 - fifthNotes.findIndex(el => el === currentKey);
    const angle = (multiplier * 30) + 15;
    return angle;
  },
);
