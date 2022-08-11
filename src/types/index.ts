import { NavigateFunction, Params } from "react-router-dom";

export interface ActionType {
  type: string;
  payload: any;
}

export interface StateType {
  user: any;
}

export interface RouterType {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

export interface ErrorType {
  field: string;
  value: string;
}
