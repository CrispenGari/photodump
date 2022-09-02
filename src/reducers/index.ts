import { combineReducers } from "redux";
import { albumPhotosReducer } from "./albumPhotosReducer";
import { albumReducer } from "./albumReducer";
import { hiddenPhotosModalReducer } from "./hiddenPhotosModalReducer";
import { userReducer } from "./userReducer";

export const rootReducers = combineReducers({
  user: userReducer,
  album: albumReducer,
  albumPhotos: albumPhotosReducer,
  openHiddenPhotos: hiddenPhotosModalReducer,
});
