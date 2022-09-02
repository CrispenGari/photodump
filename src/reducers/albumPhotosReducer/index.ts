import { constants } from "../../constants";
import { ActionType, AllPhotosType } from "../../types";
export const albumPhotosReducer = (
  state: AllPhotosType = {
    all: [],
    favorites: [],
    recent: [],
    hidden: [],
  },
  { type, payload }: ActionType
) => {
  switch (type) {
    case constants.SET_ALBUM_PHOTOS: {
      if (payload.album === "RECENT") {
        return (state = { ...state, recent: payload.photos });
      } else if (payload.album === "FAVORITES") {
        return (state = { ...state, favorites: payload.photos });
      } else if (payload.album === "HIDDEN") {
        return (state = { ...state, hidden: payload.photos });
      } else {
        return (state = { ...state, all: payload.photos });
      }
    }
    default:
      return state;
  }
};
