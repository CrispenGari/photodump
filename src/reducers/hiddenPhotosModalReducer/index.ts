import { constants } from "../../constants";
import { ActionType } from "../../types";

export const hiddenPhotosModalReducer = (
  state = null,
  { type, payload }: ActionType
) => {
  switch (type) {
    case constants.SET_OPEN_HIDDEN_PHOTOS_AUTH_MODAL:
      return (state = payload);
    default:
      return state;
  }
};
