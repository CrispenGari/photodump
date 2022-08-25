import React from "react";

import "./AuthFooter.css";
interface PropsType {}
interface StateType {}
class AuthFooter extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="auth__footer">
        <p>
          {" "}
          Copyright © {new Date().getFullYear()} PhotoDump Inc. All rights
          reserved.
        </p>
      </div>
    );
  }
}

export default AuthFooter;
