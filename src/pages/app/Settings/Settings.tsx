import React from "react";
import { Header } from "../../../components";
import { withGlobalProps } from "../../../hoc";
import { GlobalPropsType } from "../../../types";
import "./Settings.css";
interface PropsType {
  globalProps: GlobalPropsType;
}
interface StateType {}
class Settings extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    // eslint-disable-next-line
    const {} = this;
    return (
      <div className="settings">
        <Header openModal={() => {}} />
        <div className="settings__main">
          <h1>Settings</h1>
        </div>
      </div>
    );
  }
}

export default withGlobalProps(Settings);
