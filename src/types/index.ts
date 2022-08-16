import { Dispatch } from "react";
import { NavigateFunction, Params } from "react-router-dom";
import { AnyAction } from "redux";

export interface ActionType {
  type: string;
  payload: any;
}

export interface StateType {
  user: any;
}

export interface GlobalPropsType {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
  dispatch: Dispatch<AnyAction>;
  user: any;
}

export interface ErrorType {
  field: string;
  value: string;
}
