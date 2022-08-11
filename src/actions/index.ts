import constants from "../constants";

export const setUser = (payload: any) => {
  return {
    payload,
    type: constants.SET_USER,
  };
};
