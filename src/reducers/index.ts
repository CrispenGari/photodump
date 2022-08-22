import { combineReducers } from "redux";
import { albumReducer } from "./albumReducer";
import { userReducer } from "./userReducer";

export const rootReducers = combineReducers({
  user: userReducer,
  album: albumReducer,
});
