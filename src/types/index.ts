import { Dispatch } from "react";
import { NavigateFunction, Params } from "react-router-dom";
import { AnyAction } from "redux";

export interface ActionType {
  type: string;
  payload: any;
}

export interface AllPhotosType {
  all: PhotoType[];
  favorites: PhotoType[];
  recent: PhotoType[];
  hidden: PhotoType[];
}
export interface AlbumType {
  current?: PhotoType;
  albumName: "RECENT" | "FAVORITES" | "ALL" | "HIDDEN";
}
export interface StateType {
  user: UserType;
  album: AlbumType;
  albumPhotos: AllPhotosType;
}

export interface GlobalPropsType {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
  dispatch: Dispatch<AnyAction>;
  user: UserType | null;
  album: AlbumType;
  albumPhotos: AllPhotosType;
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
  hidden?: true | false;
}

export interface DocType {
  user: UserType;
  photos: Array<PhotoType>;
}
