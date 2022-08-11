import React from "react";
import { Routes as R, Route } from "react-router-dom";
import { Home } from "../pages/app";
import { SignIn, SignUp, Welcome } from "../pages/auth";
import { NotFound } from "../pages/common";

interface PropsType {
  user: any;
}
interface StateType {}
export class Routes extends React.Component<PropsType, StateType> {
  render() {
    const { user } = this.props;
    if (user) {
      return (
        <R>
          <Route path="/" caseSensitive element={<Home />} />
          <Route path="*" element={<NotFound />} caseSensitive />
        </R>
      );
    }
    return (
      <R>
        <Route path="/auth/sign-in" caseSensitive element={<SignIn />} />
        <Route path="/auth/sign-up" caseSensitive element={<SignUp />} />
        <Route path="/" caseSensitive element={<Welcome />} />
        <Route path="*" element={<NotFound />} caseSensitive />
      </R>
    );
  }
}
