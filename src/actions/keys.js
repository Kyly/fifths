export const KEY_CHANGE = 'KEY_CHANGE';
export const SCALE_CHANGE = 'SCALE_CHANGE';
export const TOGGLE_PARALLEL = 'TOGGLE_PARALLEL';
export const TOGGLE_RELATIVE = 'TOGGLE_RELATIVE';

export const changeKey = newKey => ({ type: KEY_CHANGE, newKey });
export const changeScale = scale => ({ type: SCALE_CHANGE, scale });
export const toggleParallel = shouldShow => ({ type: TOGGLE_PARALLEL, shouldShow });
export const toggleRelative = shouldShow => ({ type: TOGGLE_RELATIVE, shouldShow });
