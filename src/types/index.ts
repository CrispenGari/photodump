import { Dispatch } from "react";
import { NavigateFunction, Params } from "react-router-dom";
import { AnyAction } from "redux";

export interface ActionType {
  type: string;
  payload: any;
}

export interface AlbumType {
  current?: PhotoType;
  albumName: "RECENT" | "FAVORITES" | "ALL";
}
export interface StateType {
  user: UserType;
  album: AlbumType;
}

export interface GlobalPropsType {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
  dispatch: Dispatch<AnyAction>;
  user: UserType | null;
  album: AlbumType;
}

export interface ErrorType {
  field: string;
  value: string;
}

export interface UserType {
  displayName: string;
  email: string;
  phoneNumber?: string;
  emailVerified: boolean;
  photoURL?: string;
  uid: string;
}

export interface PhotoType {
  id: string;
  url: string;
  favoured: true | false;
  timestamp: Date;
  name?: string;
}

export interface DocType {
  user: UserType;
  photos: Array<PhotoType>;
}
