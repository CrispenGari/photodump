import { constants } from "../constants";

export const setUser = (payload: any) => {
  return {
    payload,
    type: constants.SET_USER,
  };
};
export const setAlbum = (payload: any) => {
  return {
    payload,
    type: constants.SET_ALBUM,
  };
};
