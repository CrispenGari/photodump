import { constants } from "../../constants";
import { ActionType, AlbumType } from "../../types";
export const albumReducer = (
  state: AlbumType = {
    current: undefined,
    albumName: "ALL",
  },
  { type, payload }: ActionType
) => {
  switch (type) {
    case constants.SET_ALBUM:
      return (state = payload);
    default:
      return state;
  }
};
