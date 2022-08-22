import { constants } from "../../constants";
import { ActionType } from "../../types";
export const albumReducer = (state: any, { type, payload }: ActionType) => {
  switch (type) {
    case constants.SET_ALBUM:
      return (state = payload);
    default:
      return state;
  }
};
