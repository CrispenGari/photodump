import constants from "../../constants";
import { ActionType } from "../../types";

export const userReducer = (state = null, { type, payload }: ActionType) => {
  switch (type) {
    case constants.SET_USER:
      return (state = payload);
    default:
      return state;
  }
};
