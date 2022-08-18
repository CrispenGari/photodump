import React from "react";
import { Header } from "../../../components";
import "./All.css";
interface PropsType {}
interface StateType {}
class All extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }
  render() {
    // eslint-disable-next-line
    const {} = this;
    return (
      <div className="all">
        <Header openModal={() => {}} />
        <div className="all__main">
          <h1>All</h1>
        </div>
      </div>
    );
  }
}

export default All;
