export const SET_CENTROIDS = 'SET_CENTROIDS';
export const SET_ANGLES = 'SET_ANGLES';
export const SET_ROTATION = 'SET_ROTATION';

export const setCentroids = centroids => ({ type: SET_CENTROIDS, centroids });
export const setAngles = angles => ({ type: SET_ANGLES, angles });
export const setRotation = rotation => ({ type: SET_ROTATION, rotation });
