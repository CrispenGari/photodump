import React from "react";
import "./Footer.css";
interface PropsType {}
interface StateType {}
class Footer extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="footer">
        <div className="footer__header">
          <h1>PhotoDump</h1>
        </div>
        <div className="footer__body"></div>
        <div className="footer__footer">
          <p> Copyright © 2022 PhotoDump Inc. All rights reserved</p>
        </div>
      </div>
    );
  }
}

export default Footer;
