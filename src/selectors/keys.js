import { createSelector } from 'reselect';
import { majorQualities, minorQualities, tonalGravity } from '../static/keySignatures';

/*
** key array
** [ { quality: '', parallel: '', relative: '', } ]
*/


export const getKeyObject = createSelector(
  state => state.keys.currentKey,
  state => state.keys.scale,
  (key, scale) => {
    const goldy = tonalGravity.slice();
    let pattern;

    const indexOfHighest = goldy.findIndex(el => el.note === 'A♭');
    const indexOfLowest = goldy.findIndex(el => el.note === 'C♯');

    const sharpMappings = [{ Cx: 'D' }, { Fx: 'G' }, { 'B♯': 'C' }, { 'E♯': 'F' }, { 'A♯': 'B♭' }, { 'D♯': 'E♭' }, { 'G♯': 'A♭' }];
    const flatMappings = [{ 'D♭': 'C♯' }, { 'G♭': 'F♯' }, { 'C♭': 'B' }, { 'F♭': 'E' }, { 'B♭♭': 'A' }, { 'E♭♭': 'D' }];
    let rootIndex;

    rootIndex = goldy.findIndex(el => el.note === key);
    if (rootIndex > indexOfHighest) {
      const map = flatMappings.find(note => Object.keys(note)[0] === key);
      const value = Object.values(map)[0];
      rootIndex = goldy.findIndex(el => el.note === value);
    } else if (rootIndex < indexOfLowest) {
      const map = sharpMappings.find(note => Object.keys(note)[0] === key);
      const value = Object.values(map)[0];
      rootIndex = goldy.findIndex(el => el.note === value);
    }

    if (scale === 'maj') {
      rootIndex -= 5;
      pattern = majorQualities;
    } else {
      rootIndex -= 2;
      pattern = minorQualities;
    }

    for (let i = 0; i < 7; i++) {
      goldy[rootIndex + i] = Object.assign({}, goldy[rootIndex + i], { quality: pattern[i] });
    }

    // relative key
    if (pattern === majorQualities) {
      pattern = minorQualities;
    } else {
      pattern = majorQualities;
    }
    for (let i = 0; i < 7; i++) {
      goldy[rootIndex + i] = Object.assign({}, goldy[rootIndex + i], { relative: pattern[i] });
    }

    // parallel key
    if (scale === 'maj') {
      rootIndex += 3;
    } else {
      rootIndex -= 3;
    }
    for (let i = 0; i < 7; i++) {
      goldy[rootIndex + i] = Object.assign({}, goldy[rootIndex + i], { parallel: pattern[i] });
    }

    return goldy;
  },
);

export const fifths = createSelector(
  state => getKeyObject(state),
  (key) => {
    if (!Array.isArray(key)) {
      return [];
    }
    const startIndex = key.findIndex(el => Object.keys(el).includes('quality'));
    const endIndex = startIndex + 12;
    const returnArray = key.filter((el, i) => (i >= startIndex && i < endIndex));
    return returnArray;
  },
);

export const rotation = createSelector(
  state => state.keys.currentKey,
  state => fifths(state),
  (currentKey, fifthNotes) => {
    const multiplier = fifthNotes.length - 1 - fifthNotes.findIndex(el => el.quality === 'I' || el.quality === 'i');
    const angle = (multiplier * 30) + 15;
    return angle;
  },
);
